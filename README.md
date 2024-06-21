# About this Chatbot app
This is a sample Chatbot application based on the Open AI cookbook example from [here](https://cookbook.openai.com/examples/how_to_build_an_agent_with_the_node_sdk).  It's been adapted to work as a 2-tier application with a React Front-end and a backend built using Fastify on a Node.js server.


# Running the Todo app locally
Prerequisites:

- Node 16+

## Installing dependencies
Run the following from both the <b>/client</b> and <b>/server</b> folders:

```
npm install
```

## Running it locally
First let's start the client which will run on port 3000.

```
cd client
npm start
```

Then let's add a <b>.env</b> file under the <b>/server</b> folder which contains the OpenAI API key to talk to OpenAI.  If you're not sure how to get one, the app itself will explain how to get this information if you've forgotten to set this. NOTE: This file is explicitly ignored in .gitignore so it won't accidentally be commited and pushed to GitHub.  It's for local use only.

.env file example
```
OPENAI_API_KEY="<PUT YOUR OPEN AI API KEY HERE>"
```

Then let's start the server which will run on port 3001.

```
cd server
npm run build
npm start
```

Once both the client and server are running, <b>http://localhost:4280</b>