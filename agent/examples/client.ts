import { MCPClient } from "@mastra/mcp"

const mcp = new MCPClient({
  servers: {
    fairspec: {
      command: "node",
      args: ["agent/main.ts"],
    },
  },
})

const tools = await mcp.listTools()
const toolsets = await mcp.listToolsets()

console.log(tools)
console.log(toolsets)
