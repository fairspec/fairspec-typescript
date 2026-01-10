import { z } from "zod"
import { BaseColumn } from "./base.ts"

// TODO: Should allow all the JSON Schema properties

export const BaseObjectColumn = BaseColumn.extend({
  type: z.literal("object"),
  property: BaseColumn.shape.property.extend({
    type: z.literal("object"),

    enum: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("An optional array of allowed values for the column"),

    examples: z
      .array(z.record(z.string(), z.unknown()))
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

export const ObjectColumn = BaseObjectColumn.extend({
  property: BaseObjectColumn.shape.property.extend({
    format: z.undefined().optional(),
  }),
})

export type ObjectColumn = z.infer<typeof ObjectColumn>
