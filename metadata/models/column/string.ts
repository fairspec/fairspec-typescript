import { z } from "zod"
import { BaseColumn } from "./base.ts"

export const StringColumn = BaseColumn.extend({
  type: z.literal("string"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("string"),
    format: z.undefined().optional(),

    enum: z
      .array(z.string())
      .optional()
      .describe("An optional array of allowed values for the column"),

    pattern: z
      .string()
      .optional()
      .describe(
        "An optional regular expression pattern that values must match",
      ),

    minLength: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe("An optional minimum length constraint for string values"),

    maxLength: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe("An optional maximum length constraint for string values"),

    // TODO: categories should not be avaialbe for string children like email, url, etc.?
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
  }),
})

export type StringColumn = z.infer<typeof StringColumn>
