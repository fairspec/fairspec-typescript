import { MCPServer } from "@mastra/mcp"
import packageJson from "./package.json" with { type: "json" }
import { validateTableTool } from "./tools/table/validate.ts"
import { inferTableSchemaTool } from "./tools/tableSchema/infer.ts"

export const server = new MCPServer({
  name: "fairspec",
  version: packageJson.version,
  tools: {
    inferTableSchemaTool,
    validateTableTool,
  },
})
