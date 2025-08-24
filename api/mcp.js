import { FastMCP } from "fastmcp";
import { z } from "zod";
import { askAnsari, DEFAULT_ANSARI_API_URL } from '../dist/ansari-service.js';

const server = new FastMCP({
  name: "Ansari",
  version: "1.0.0",
});

server.addTool({
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    title: "Answer Islamic Question",
  },
  name: "answer_islamic_question",
  description: "Answer Islamic question",
  parameters: z.object({
    question: z.string().describe("The islamic question")
  }),
  execute: async (args, { log, reportProgress }) => {
    log.info("Question: ", args.question);

    await reportProgress({ progress: 0, total: 100 });

    const response = await askAnsari(args.question, DEFAULT_ANSARI_API_URL);

    await reportProgress({ progress: 100, total: 100 });

    log.info("Ansari :", response);
    return response;
  },
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Create a custom request/response handler for Vercel
  const mockReq = {
    method: req.method,
    headers: req.headers,
    body: req.body
  };

  const mockRes = {
    writeHead: (statusCode, headers) => {
      res.status(statusCode);
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
    },
    write: (chunk) => {
      res.write(chunk);
    },
    end: (chunk) => {
      if (chunk) res.write(chunk);
      res.end();
    }
  };

  // Use FastMCP's HTTP handler
  try {
    await server.handleHTTP(mockReq, mockRes);
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}