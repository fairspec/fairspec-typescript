import { z } from "zod"
import { BaseColumn } from "../Base.ts"

export const BaseStringColumn = BaseColumn.extend({
  type: z.literal("string"),

  enum: z
    .array(z.string())
    .optional()
    .describe("An optional array of allowed values for the column"),

  pattern: z
    .string()
    .optional()
    .describe("An optional regular expression pattern that values must match"),

  categories: z
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
    .describe("An optional array of categorical values with optional labels"),

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
      "An optional column-specific list of values that represent missing or null data",
    ),
})

export type BaseStringColumn = z.infer<typeof BaseStringColumn>
