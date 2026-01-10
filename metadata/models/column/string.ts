import { z } from "zod"
import { BaseColumn } from "./base.ts"

export const BaseStringColumn = BaseColumn.extend({
  type: z.literal("string"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("string"),

    enum: z
      .array(z.string())
      .optional()
      .describe("An optional array of allowed values for the column"),

    examples: z
      .array(z.string())
      .optional()
      .describe("An optional array of examples for the column"),

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

    pattern: z
      .string()
      .optional()
      .describe(
        "An optional regular expression pattern that values must match",
      ),
  }),
})

export const StringColumn = BaseStringColumn.extend({
  type: z.literal("string"),
  property: BaseStringColumn.shape.property.extend({
    format: z.undefined().optional(),

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

    categoriesOrdered: z
      .boolean()
      .optional()
      .describe(
        "An optional boolean indicating whether the categories are ordered",
      ),
  }),
})

export type StringColumn = z.infer<typeof StringColumn>
