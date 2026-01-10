import { z } from "zod"
import { BaseColumn } from "./base.ts"

// TODO: Should allow all the JSON Schema properties

export const ArrayColumn = BaseColumn.extend({
  type: z.literal("array"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("array"),
    format: z.undefined().optional(),

    enum: z
      .array(z.array(z.unknown()))
      .optional()
      .describe("An optional array of allowed values for the column"),

    examples: z
      .array(z.array(z.unknown()))
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
  }),
})

export type ArrayColumn = z.infer<typeof ArrayColumn>
