import {
  Dialect,
  InferDialectOptions,
  inferDialect,
  Resource,
} from "@fairspec/library"
import { createTool } from "@mastra/core/tools"
import { z } from "zod"

export const inferDialectTool = createTool({
  id: "infer-dialect",
  description:
    "Infer the dialect (format and format-specific properties) from a resource. Analyzes the data to determine CSV delimiters, JSON structure, etc.",
  inputSchema: z.object({
    resource: Resource.describe("The resource to infer dialect from"),
    options: InferDialectOptions.optional().describe(
      "Dialect inference options",
    ),
  }),
  outputSchema: z.object({
    dialect: Dialect.optional(),
  }),
  execute: async input => {
    const dialect = await inferDialect(input.resource, input.options)
    return { dialect }
  },
})
