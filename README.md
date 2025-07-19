## Setup

```
mkdir ansari_mcp_fastmcp
cd ansari_mcp_fastmcp
pnpm init
pnpm add fastmcp axios dotenv
pnpm add -D typescript ts-node @types/node tsx
npx tsc --init
```

# Testing with FastMCP tools

```
npm run dev

> ansari_mcp_fastmcp@1.0.0 dev
> npx fastmcp dev src/server.ts

⠙ Connecting to server...npm warn exec The following package was not found and will be installed: tsx@4.20.3
✔ Connected, server capabilities: logging, tools
✔ Pick a primitive › tool(answer_islamic_question)
✔ * question … What is Ramadan?
⠋ Using tool answer_islamic_question...[server log]: { context: 'What is Ramadan?', message: 'Question: ' }
[server log]: { context: 'Answer from Ansari.', message: 'Ansari :' }
✔ Using tool answer_islamic_question...
{ content: [ { type: 'text', text: 'Answer from Ansari.' } ] }
```


## MCP Inspector

```
npx @modelcontextprotocol/inspector tsx src/server.ts
Starting MCP inspector...
⚙️ Proxy server listening on localhost:6277
🔑 Session token: e7cb5f1b031d28927412d114e3dd9cfc288716da37f35700c43901cf1cc4a981
   Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

🚀 MCP Inspector is up and running at:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=e7cb5f1b031d28927412d114e3dd9cfc288716da37f35700c43901cf1cc4a981

🌐 Opening browser...
New STDIO connection request
STDIO transport: command=/home/abdu/projects/ansari_mcp_fastmcp/node_modules/.bin/tsx, args=src/server.ts
Created server transport
Created client transport
```

