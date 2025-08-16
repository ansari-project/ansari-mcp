import { FastMCP } from "fastmcp";
import { z } from "zod";
import { askAnsari, DEFAULT_ANSARI_API_URL } from './ansari-service.js';

// Parse command line arguments
const args = process.argv.slice(2);
const isHttpMode = args.includes('--http') || args.includes('-h');

// Parse API URL from command line
let apiUrl = DEFAULT_ANSARI_API_URL;
const apiUrlIndex = args.findIndex(arg => arg === '--api-url' || arg === '-u');
if (apiUrlIndex !== -1 && args[apiUrlIndex + 1]) {
  apiUrl = args[apiUrlIndex + 1];
  // Only log in HTTP mode to avoid breaking stdio protocol
  if (isHttpMode) {
    console.log(`Using Ansari API URL: ${apiUrl}`);
  }
}

const server = new FastMCP({
  name: "Ansari",
  version: "1.0.0",
});

server.addTool({
  annotations: {
    openWorldHint: true, // This tool interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    //streamingHint: true, // Signals this tool uses streaming
    title: "Answer Islamic Question",
  },
  name: "answer_islamic_question",
  description: "Answer Islamic question",
  parameters: z.object({
    question: z.string().describe("The islamic question")
  }),
  execute: async (args, { log, reportProgress }) => {
    log.info("Question: ", args.question);

    // Report initial progress
    await reportProgress({ progress: 0, total: 100 });

    const response = await askAnsari(args.question, apiUrl);

    // Report completion
    await reportProgress({ progress: 100, total: 100 });

    log.info("Ansari :", response);
    return response;
  },
});


// Start the server in the appropriate mode
if (isHttpMode) {
  console.log("Starting Ansari MCP server in HTTP mode on http://localhost:8089/mcp");
  server.start({
    transportType: "httpStream",
    httpStream: {
      port: 8089,
      endpoint: "/mcp"
    },
  });
} else {
  // stdio mode for Claude Desktop
  server.start();
}