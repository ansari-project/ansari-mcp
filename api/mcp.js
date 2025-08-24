import { askAnsari, DEFAULT_ANSARI_API_URL } from '../dist/ansari-service.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
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
      
      // Handle different MCP protocol methods
      if (message.method === 'initialize') {
        res.status(200).json({
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
        });
      } else if (message.method === 'tools/list') {
        res.status(200).json({
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
        });
      } else if (message.method === 'tools/call') {
        const { name, arguments: args } = message.params;
        
        if (name === 'answer_islamic_question') {
          try {
            const response = await askAnsari(args.question, DEFAULT_ANSARI_API_URL);
            res.status(200).json({
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
            });
          } catch (error) {
            res.status(200).json({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: -32603,
                message: 'Internal error',
                data: error.message
              }
            });
          }
        } else {
          res.status(200).json({
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -32601,
              message: 'Method not found'
            }
          });
        }
      } else {
        res.status(200).json({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32601,
            message: 'Method not found'
          }
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}