import { z } from "zod"
import { BaseColumn } from "./base.ts"

export const BooleanColumn = BaseColumn.extend({
  type: z.literal("boolean"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("boolean"),
    format: z.undefined().optional(),

    enum: z
      .array(z.boolean())
      .optional()
      .describe("An optional array of allowed values for the column"),

    trueValues: z
      .array(z.string())
      .optional()
      .describe(
        "An optional array of string values that should be interpreted as true when parsing data",
      ),

    falseValues: z
      .array(z.string())
      .optional()
      .describe(
        "An optional array of string values that should be interpreted as false when parsing data",
      ),

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

export type BooleanColumn = z.infer<typeof BooleanColumn>
