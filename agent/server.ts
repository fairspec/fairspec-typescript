import { MCPServer } from "@mastra/mcp"
import packageJson from "./package.json" with { type: "json" }
import { inferDataSchemaTool } from "./tools/dataSchema/infer.ts"
import { validateDataSchemaTool } from "./tools/dataSchema/validate.ts"
import { validateTableTool } from "./tools/table/validate.ts"
import { inferTableSchemaTool } from "./tools/tableSchema/infer.ts"
import { validateTableSchemaTool } from "./tools/tableSchema/validate.ts"

export const server = new MCPServer({
  name: "fairspec",
  version: packageJson.version,
  tools: {
    inferDataSchemaTool,
    inferTableSchemaTool,
    validateDataSchemaTool,
    validateTableSchemaTool,
    validateTableTool,
  },
})
