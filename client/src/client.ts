import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";

let baseHostUrl = '/api';

// eslint-disable-next-line no-restricted-globals
if (location.host === 'localhost:3000') {

    // If you're running locally without the SWA emulator then the port of the express server
    // is set to 3001.
    baseHostUrl = 'http://localhost:3001/api';
    console.log('Warning: Running without emulator. Role and authorization will not be taken into account.');
}

export const pingServer = async () =>{
    return await fetch(`${baseHostUrl}/ping`);
}

export const callQuery = async (messages: Array<ChatCompletionMessageParam>, tools: Array<ChatCompletionTool>) => {
    return await fetch(`${baseHostUrl}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            messages,
            tools
        })
    });
}