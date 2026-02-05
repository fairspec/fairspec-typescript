import { MCPServer } from "@mastra/mcp"
import packageJson from "./package.json" with { type: "json" }

export const server = new MCPServer({
  name: "fairspec",
  version: packageJson.version,
  tools: {},
})
