import fastify from 'fastify'
import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
require('dotenv').config();

let openAi: OpenAI;

try {
  openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch(e) {
  console.error(e);
}

interface QueryInput {
  Body: {
    messages: Array<ChatCompletionMessageParam>;
    tools: Array<ChatCompletionTool>;
  }
}

const server = fastify({
  // logger: true
})

server.register(require('@fastify/cors'), {
  origin: '*',
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
});

server.get('/api/ping', async (request, reply) => {
  if (openAi) {
    return { success: true };
  } else {
    reply.code(500).send({ success: false, reason: 'MissingOpenAIKey' });
  }
})

server.post<QueryInput>('/api/query', async (request, reply) => {
  const { messages, tools } = request.body;

  const response = await openAi.chat.completions.create({
    model: "gpt-4",
    messages: messages,
    tools: tools,
  });

  return response;
})

server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})