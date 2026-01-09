import { z } from "zod"
import { BaseColumn } from "./base.ts"

export const NumberColumn = BaseColumn.extend({
  type: z.literal("number"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("number"),
    format: z.undefined().optional(),

    enum: z
      .array(z.number())
      .optional()
      .describe("An optional array of allowed values for the column"),

    minimum: z
      .number()
      .optional()
      .describe("An optional minimum value constraint (inclusive)"),

    maximum: z
      .number()
      .optional()
      .describe("An optional maximum value constraint (inclusive)"),

    exclusiveMinimum: z
      .number()
      .optional()
      .describe("An optional minimum value constraint (exclusive)"),

    exclusiveMaximum: z
      .number()
      .optional()
      .describe("An optional maximum value constraint (exclusive)"),

    multipleOf: z
      .number()
      .positive()
      .optional()
      .describe(
        "An optional constraint that values must be a multiple of this number",
      ),

    missingValues: z
      .array(
        z.union([
          z.string(),
          z.number(),
          z.object({
            value: z.union([z.string(), z.number()]),
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

export type NumberColumn = z.infer<typeof NumberColumn>
