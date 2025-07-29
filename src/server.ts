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
    //streamingHint: true, // Signals this tool uses streaming
    title: "Answer Islamic Question",
  },
  name: "answer_islamic_question",
  description: "Answer Islamic question",
  parameters: z.object({
    question: z.string().describe("The islamic question")
  }),
  execute: async (args, { log, reportProgress }) => {

    console.log("Question: ", args.question)
    log.info("Question: ", args.question);

    // Report initial progress
    await reportProgress({ progress: 0, total: 100 });

    const response = await askAnsari(args.question);

    // Report completion
    await reportProgress({ progress: 100, total: 100 });

    log.info("Ansari :", response);
    console.log("Recieved response from Ansari")
    return response;
  },
});


// Start the server using httpstream transport
server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8089,
    endpoint: "/mcp"
  },
});