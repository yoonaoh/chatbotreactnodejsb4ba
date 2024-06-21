import React, { useEffect, useState } from 'react';
import './App.css';
import { ChatControl } from './components/ChatControl';
import { ChatMessage } from './components/ChatCard';
import { conversationAgent } from './conversationAgent';
import { pingServer } from './client';

let initialized = false;

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showInternalCalls, setShowInternalCalls] = useState(false);

  useEffect(() => {
    // React.StrictMode causes the component to render twice in dev mode so just
    // preventing this from running multiple times for local development.
    if (initialized) {
      return;
    }

    initialized = true;

    const init = async () => {
      const initialChatMessages: ChatMessage[] = []

      const response = await pingServer();
      if (!response.ok) {
        let body: any = null;
        try {
          body = await response.json();
        } catch (e) { 
          console.log(e);
          body = e;
        }

        if (body.reason === 'MissingOpenAIKey') {
          initialChatMessages.push({
            isLoading: false,
            role: 'localAssistant',
            isEnvVarError: true
          });
        } else {
          initialChatMessages.push({
            isLoading: false,
            role: 'localAssistant',
            content: `There was an error connecting to the server. Please try again later.`
          });
        }
      } else {
        initialChatMessages.push(
          {
            isLoading: false,
            content: `You are a helpful assistant. Only use the functions you have been provided with.`,
            role: 'system',
            name: 'system'
          },
          {
            isLoading: false,
            content: `Hi! I'm a bot that specializes in suggesting activies based on your location and the weather.  How can I help you?`,
            role: 'localAssistant'
          });
      }

      setChatMessages(initialChatMessages);
    }

    init();
  }, []);

  const onSend = async (chatMessages: ChatMessage[]) => {

    chatMessages.push({
      isLoading: true,
      role: 'localAssistant'
    });

    setChatMessages(chatMessages);

    try {
      let responseMessages = await conversationAgent(chatMessages);
      responseMessages = responseMessages.filter(m => !m.isLoading);
      setChatMessages(responseMessages);

    } catch (error) {
      console.log(error);
    }
  }

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowInternalCalls(event.target.checked);
  }

  return (
    <div>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" id="verbositySwitch" onChange={onSwitchChange} />
        <label className="form-check-label" htmlFor="verbositySwitch">Show internal calls</label>
      </div>
      <ChatControl chatMessages={chatMessages} onSend={onSend} showinternalCalls={showInternalCalls}></ChatControl>
    </div>
  );
}

export default App;
