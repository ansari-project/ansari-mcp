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
          tools: {}
          // Removed logging capability since we don't need it for this simple server
        },
        serverInfo: {
          name: 'Ansari',
          version: '1.0.0'
        }
      }
    };
  } else if (message.method === 'logging/setLevel') {
    // Handle logging level changes
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {}
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
  // Set comprehensive CORS headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    // For GET requests, return server info
    if (req.method === 'GET') {
      res.status(200).json({
        name: "Ansari",
        version: "1.0.0",
        status: "ready",
        endpoint: "/mcp"
      });
      return;
    }

    // For POST requests, handle MCP protocol messages
    if (req.method === 'POST') {
      const message = req.body;
      
      // Log the incoming request for debugging
      console.log('Received MCP request:', JSON.stringify(message));
      
      const response = await handleJsonRpcMessage(message);
      
      // Log the outgoing response for debugging
      console.log('Sending MCP response:', JSON.stringify(response));
      
      res.status(200).json(response);
      return;
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}