import { askAnsari, DEFAULT_ANSARI_API_URL } from '../dist/ansari-service.js';

// Helper function to handle JSON-RPC messages
async function handleJsonRpcMessage(message) {
  // Handle different MCP protocol methods
  if (message.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          logging: {}
        },
        serverInfo: {
          name: 'Ansari',
          version: '1.0.0'
        }
      }
    };
  } else if (message.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        tools: [{
          name: 'answer_islamic_question',
          description: 'Answer Islamic question',
          inputSchema: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The islamic question'
              }
            },
            required: ['question']
          }
        }]
      }
    };
  } else if (message.method === 'tools/call') {
    const { name, arguments: args } = message.params;
    
    if (name === 'answer_islamic_question') {
      try {
        const response = await askAnsari(args.question, DEFAULT_ANSARI_API_URL);
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: [
              {
                type: 'text',
                text: response
              }
            ]
          }
        };
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32603,
            message: 'Internal error',
            data: error.message
          }
        };
      }
    } else {
      return {
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32601,
          message: 'Method not found'
        }
      };
    }
  } else {
    return {
      jsonrpc: '2.0',
      id: message.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    };
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check Accept header to determine if SSE is requested
    const acceptHeader = req.headers.accept || '';
    const isSSE = acceptHeader.includes('text/event-stream');
    
    // For GET requests with SSE accept header, handle as SSE
    if (req.method === 'GET' && isSSE) {
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      
      // Send initial SSE connection message
      res.write(':ok\n\n');
      
      // Keep the connection alive
      const keepAliveInterval = setInterval(() => {
        res.write(':keepalive\n\n');
      }, 30000);
      
      // Handle connection close
      req.on('close', () => {
        clearInterval(keepAliveInterval);
      });
      
      return;
    }
    
    // For regular GET requests, return server info
    if (req.method === 'GET') {
      res.status(200).json({
        name: "Ansari",
        version: "1.0.0",
        status: "ready",
        endpoint: "/mcp"
      });
      return;
    }

    // For POST requests with SSE, handle the message and respond via SSE
    if (req.method === 'POST' && isSSE) {
      const message = req.body;
      const response = await handleJsonRpcMessage(message);
      
      // Send SSE response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.write(`data: ${JSON.stringify(response)}\n\n`);
      res.end();
      return;
    }

    // For regular POST requests, handle MCP protocol messages
    if (req.method === 'POST') {
      const message = req.body;
      const response = await handleJsonRpcMessage(message);
      res.status(200).json(response);
      return;
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}