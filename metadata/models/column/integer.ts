import { z } from "zod"
import { BaseColumn } from "./base.ts"

export const IntegerColumn = BaseColumn.extend({
  type: z.literal("integer"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("integer"),
    format: z.undefined().optional(),

    enum: z
      .array(z.int())
      .optional()
      .describe("An optional array of allowed values for the column"),

    minimum: z
      .int()
      .optional()
      .describe("An optional minimum value constraint (inclusive)"),

    maximum: z
      .int()
      .optional()
      .describe("An optional maximum value constraint (inclusive)"),

    exclusiveMinimum: z
      .int()
      .optional()
      .describe("An optional minimum value constraint (exclusive)"),

    exclusiveMaximum: z
      .int()
      .optional()
      .describe("An optional maximum value constraint (exclusive)"),

    multipleOf: z
      .int()
      .min(1)
      .optional()
      .describe(
        "An optional constraint that values must be a multiple of this number",
      ),

    categories: z
      .array(
        z.union([
          z.int(),
          z.object({
            value: z.int(),
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
          z.int(),
          z.object({
            value: z.union([z.string(), z.int()]),
            label: z.string(),
          }),
        ]),
      )
      .optional()
      .describe(
        "An optional column-specific list of values that represent missing or null data",
      ),

    groupChar: z
      .string()
      .length(1)
      .optional()
      .describe(
        "An optional single character used as the thousands separator in the data",
      ),

    withText: z
      .boolean()
      .optional()
      .describe(
        "An optional boolean indicating whether numeric values may include non-numeric text that should be stripped during parsing",
      ),
  }),
})

export type IntegerColumn = z.infer<typeof IntegerColumn>
