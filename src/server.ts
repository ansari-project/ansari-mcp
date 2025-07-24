import { FastMCP } from "fastmcp";
import { z } from "zod";
import { askAnsari } from './ansariService';

const server = new FastMCP({
  name: "Ansari",
  version: "1.0.0",
});

server.addTool({
  annotations: {
    openWorldHint: true, // This tool interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
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

    const response = await askAnsari(args.question, log);

    // Report completion
    await reportProgress({ progress: 100, total: 100 });

    log.info("Ansari :", response);
    return response;
  },
});

// Start the server with stdio transport for MCP clients
server.start({
  transportType: "stdio",
});