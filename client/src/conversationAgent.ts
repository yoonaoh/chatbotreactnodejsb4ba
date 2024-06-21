import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import { callQuery } from "./client";
import { ChatMessage } from "./components/ChatCard";

const tools: Array<ChatCompletionTool> = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "string",
          },
          longitude: {
            type: "string",
          },
        },
        required: ["longitude", "latitude"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get the user's location based on their IP address",
      parameters: {
        type: "object",
        properties: {},
      },
    }
  },
];

async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  return locationData;
}

async function getCurrentWeather(latitude: string, longitude: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

const availableTools: any = {
  getCurrentWeather,
  getLocation,
};

// The chat messages which come from the user interface contains extra stuff that ChatGPT doesn't know about
// so we need to filter them out.
const filterNonGptMessages = (chatMessages: ChatMessage[]) => {
  return chatMessages
    .filter(m => m.role !== 'localAssistant')
    .map(m => {
      const content = m.content ? m.content : '';
      const name = m.name ? m.name : '';

      const message: any = {
        role: m.role,
        content
      }

      if (name) {
        message.name = name;
      }

      return message;
    })
}

export const conversationAgent = async (inputMessages: ChatMessage[]) => {

  const messages = [...inputMessages];
  for (let i = 0; i < 5; i++) {

    const gptMessages: ChatCompletionMessageParam[] = filterNonGptMessages(messages);
    const response = await callQuery(gptMessages, tools);
    if (!response.ok) {
      throw Error(`Failed to get response from server: ${response.status}, ${response.statusText}`);
    }
    const body = await response.json();
    const { finish_reason, message } = body.choices[0];

    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name;
      const functionToCall = availableTools[functionName];
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs);
      const functionResponse = await functionToCall.apply(
        null,
        functionArgsArr
      );

      messages.push({
        role: "function",
        name: functionName,
        content: `The result of the function '${functionName}' was this: ${JSON.stringify(functionResponse)}`,
        isLoading: false
      });
    } else if (finish_reason === "stop") {
      messages.push({
        isLoading: false,
        role: message.role,
        content: message.content,
      });

      return messages;
    }
  }

  messages.push({
    isLoading: false,
    role: 'assistant',
    content: 'The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.'
  });

  return messages;
};