import { MCPClient } from "@mastra/mcp"

const mcp = new MCPClient({
  servers: {
    // Give this MCP server instance a name
    yourServerName: {
      command: "node",
      args: ["agent/main.ts"], // Replace with your package name
    },
  },
})

// You can then get tools or toolsets from this configuration to use in your agent
const tools = await mcp.listTools()
const toolsets = await mcp.listToolsets()

console.log(tools)
console.log(toolsets)
