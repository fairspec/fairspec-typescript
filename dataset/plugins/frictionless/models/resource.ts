import { z } from "zod"
import { FrictionlessDialect } from "./dialect.ts"
import { FrictionlessLicense } from "./license.ts"
import { FrictionlessSchema } from "./schema.ts"
import { FrictionlessSource } from "./source.ts"

export const FrictionlessResource = z.object({
  $schema: z
    .string()
    .optional()
    .describe("JSON schema profile URL for validation"),
  name: z
    .string()
    .describe(
      "Unique resource identifier. Should use lowercase alphanumeric characters, periods, hyphens, and underscores",
    ),
  path: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe(
      "A reference to the data itself, can be a path URL or array of paths. Either path or data must be provided",
    ),
  data: z
    .union([
      z.unknown(),
      z.array(z.array(z.unknown())),
      z.array(z.record(z.string(), z.unknown())),
    ])
    .optional()
    .describe(
      "Inline data content instead of referencing an external file. Either path or data must be provided",
    ),
  type: z
    .literal("table")
    .optional()
    .describe('The resource type (e.g., "table")'),
  format: z
    .string()
    .optional()
    .describe('The file format (e.g., "csv", "json", "xlsx")'),
  mediatype: z
    .string()
    .optional()
    .describe(
      'The media type of the resource (e.g., "text/csv", "application/json")',
    ),
  encoding: z
    .string()
    .optional()
    .describe('Character encoding of the resource. Default: "utf-8"'),
  title: z.string().optional().describe("Human-readable title"),
  description: z.string().optional().describe("A description of the resource"),
  bytes: z.number().optional().describe("Size of the file in bytes"),
  hash: z.string().optional().describe("Hash of the resource data"),
  sources: z.array(FrictionlessSource).optional().describe("Data sources"),
  licenses: z
    .array(FrictionlessLicense)
    .optional()
    .describe("License information"),
  dialect: z
    .union([z.string(), FrictionlessDialect])
    .optional()
    .describe(
      "Table dialect specification. Describes delimiters, quote characters, etc.",
    ),
  schema: z
    .union([z.string(), FrictionlessSchema])
    .optional()
    .describe(
      "Schema for the tabular data. Describes fields in the table, constraints, etc.",
    ),
  jsonSchema: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional()
    .describe(
      "Schema for the json data. Describes fields in the json, constraints, etc.",
    ),
})

export type FrictionlessResource = z.infer<typeof FrictionlessResource>
