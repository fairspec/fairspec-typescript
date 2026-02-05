import { MCPServer } from "@mastra/mcp"
import packageJson from "./package.json" with { type: "json" }
import { validateDataTool } from "./tools/data/validate.ts"
import { inferDataSchemaTool } from "./tools/dataSchema/infer.ts"
import { validateDataSchemaTool } from "./tools/dataSchema/validate.ts"
import { inferDatasetTool } from "./tools/dataset/infer.ts"
import { validateDatasetTool } from "./tools/dataset/validate.ts"
import { inferDialectTool } from "./tools/dialect/infer.ts"
import { validateTableTool } from "./tools/table/validate.ts"
import { inferTableSchemaTool } from "./tools/tableSchema/infer.ts"
import { validateTableSchemaTool } from "./tools/tableSchema/validate.ts"

export const server = new MCPServer({
  name: "fairspec",
  version: packageJson.version,
  tools: {
    inferDataSchemaTool,
    inferDatasetTool,
    inferDialectTool,
    inferTableSchemaTool,
    validateDataSchemaTool,
    validateDatasetTool,
    validateDataTool,
    validateTableSchemaTool,
    validateTableTool,
  },
})
