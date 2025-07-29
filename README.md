## Setup

```
cd ansari-mcp
pnpm init
pnpm add fastmcp axios dotenv
pnpm add -D typescript ts-node @types/node tsx
npx tsc --init
```

## Stdio transport

## Testing with FastMCP tools

```
npm run dev

> ansari-mcp@1.0.0 dev
> npx fastmcp dev src/server.ts

✔ Connected, server capabilities: logging, tools
✔ Pick a primitive › tool(answer_islamic_question)
✔ * question … What are the 5 pillars of Islam?
⠋ Using tool answer_islamic_question...[server log]: { context: 'What are the 5 pillars of Islam?', message: 'Question: ' }
⠇ Using tool answer_islamic_question...[server log]: { context: 200, message: 'response' }
[server log]: {
  context: '# The Five Pillars of Islam\n' +
    '\n' +
    'The Five Pillars of Islam (أركان الإسلام - Arkān al-Islām) are the fundamental practices that every Muslim is obligated to fulfill. They form the foundation of Muslim life and represent the core obligations of the faith. Let me explain each pillar:\n' +
```
## Test directly

### MCP Inspector

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

## Streamable-http transport

```
ansari-mcp$ npx tsx src/server.ts 
[FastMCP info] server is running on HTTP Stream at http://localhost:8089/mcp
[FastMCP info] Transport type: httpStream (Streamable HTTP, not SSE)

// after connecting from MCP Inspector
[FastMCP info] HTTP Stream session established
[mcp-proxy] establishing new SSE stream for session ID d123cf49-af58-477a-85ed-f3ad53add105

```

### MCP Inspector
```
ansari-mcp$ npx @modelcontextprotocol/inspector src/server.ts
Starting MCP inspector...
⚙️ Proxy server listening on localhost:6277
🔑 Session token: 18713dce776796d2a9988882caf5fdea9707d012a6a987be96e2f3bde9581f7d
   Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

🚀 MCP Inspector is up and running at:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=18713dce776796d2a9988882caf5fdea9707d012a6a987be96e2f3bde9581f7d

🌐 Opening browser...
New StreamableHttp connection request
Query parameters: {"url":"http://localhost:8089/mcp","transportType":"streamable-http"}
Created StreamableHttp server transport
Created StreamableHttp client transport
Client <-> Proxy  sessionId: 59cdf748-ecea-4f7b-80ac-373c75de8117
Proxy  <-> Server sessionId: d123cf49-af58-477a-85ed-f3ad53add105
Received POST message for sessionId 59cdf748-ecea-4f7b-80ac-373c75de8117
Received GET message for sessionId 59cdf748-ecea-4f7b-80ac-373c75de8117
Received POST message for sessionId 59cdf748-ecea-4f7b-80ac-373c75de8117
```

### MCP Server config
```
{
    "mcpServers": {
        "ansari-server": {
            "type": "streamable-http",
            "url": "http://localhost:8089/mcp",
            "note": "For Streamable HTTP connections, add this URL directly in your MCP Client"
        }
    }
}
```

## ToDo
- Testing with Claude Desktop (http streamable seems to need pro account!) 
- Configuration for ANSARI_API, MCP endpoint and port
- Vercel_mcp branch for comparison
- Vercel deployment 