import { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>Ansari MCP Server</h1>
      <p>Model Context Protocol server for Islamic Q&A</p>
      
      <h2>Endpoints</h2>
      <ul>
        <li><code>/api/mcp</code> - MCP protocol endpoint</li>
      </ul>
      
      <h2>Testing</h2>
      <p>You can test the MCP server using:</p>
      <ul>
        <li>MCP Inspector: <code>npx @modelcontextprotocol/inspector</code></li>
        <li>Direct API calls to <code>/api/mcp</code></li>
      </ul>
      
      <h2>Capabilities</h2>
      <ul>
        <li>Tool: <code>answer_islamic_question</code></li>
        <li>Logging support with configurable levels</li>
      </ul>
    </div>
  )
}

export default Home