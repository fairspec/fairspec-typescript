import { z } from "zod"
import { FrictionlessField } from "./field/field.ts"
import { FrictionlessForeignKey } from "./foreignKey.ts"

export const FrictionlessSchema = z.object({
  $schema: z.string().optional().describe("URL of profile (optional)"),
  name: z.string().optional().describe("Name of schema (optional)"),
  title: z.string().optional().describe("Title of schema (optional)"),
  description: z
    .string()
    .optional()
    .describe("Description of schema (optional)"),
  fields: z
    .array(FrictionlessField)
    .describe("Fields in this schema (required)"),
  fieldsMatch: z
    .enum(["exact", "equal", "subset", "superset", "partial"])
    .optional()
    .describe('Field matching rule (optional). Default: "exact"'),
  missingValues: z
    .array(
      z.union([
        z.string(),
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      ]),
    )
    .optional()
    .describe(
      'Values representing missing data (optional). Default: [""]. Can be a simple array of strings or an array of {value, label} objects where label provides context for why the data is missing',
    ),
  primaryKey: z
    .array(z.string())
    .optional()
    .describe("Fields uniquely identifying each row (optional)"),
  uniqueKeys: z
    .array(z.array(z.string()))
    .optional()
    .describe("Field combinations that must be unique (optional)"),
  foreignKeys: z
    .array(FrictionlessForeignKey)
    .optional()
    .describe("Foreign key relationships (optional)"),
})

export type FrictionlessSchema = z.infer<typeof FrictionlessSchema>
