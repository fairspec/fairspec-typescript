import { z } from "zod"

export const FrictionlessBaseConstraints = z.object({
  required: z
    .boolean()
    .optional()
    .describe("Indicates if field is allowed to be null/empty"),
  unique: z
    .boolean()
    .optional()
    .describe("Indicates if values must be unique within the column"),
})

export type FrictionlessBaseConstraints = z.infer<
  typeof FrictionlessBaseConstraints
>

export const FrictionlessBaseField = z.object({
  name: z.string().describe("Name of the field matching the column name"),
  format: z
    .string()
    .optional()
    .describe("Field format -- optional addition to the type"),
  title: z.string().optional().describe("Human-readable title"),
  description: z.string().optional().describe("Human-readable description"),
  example: z.any().optional().describe("Example value for this field"),
  examples: z.array(z.any()).optional().describe("Examples for this field"),
  rdfType: z.string().optional().describe("URI for semantic type (RDF)"),
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
      "Values representing missing data for this field. Can be a simple array of strings or an array of {value, label} objects where label provides context for why the data is missing",
    ),
  constraints: FrictionlessBaseConstraints.optional().describe(
    "Validation constraints applied to values",
  ),
})

export type FrictionlessBaseField = z.infer<typeof FrictionlessBaseField>
