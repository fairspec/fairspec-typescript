import { z } from "zod"
import { BaseColumn, BaseColumnProperty } from "./base.ts"

// TODO: Should allow all the JSON Schema properties

export const BaseObjectColumnProperty = BaseColumnProperty.extend({
  type: z.literal("object"),

  enum: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe("An optional array of allowed values for the column"),

  const: z
    .array(z.record(z.string(), z.unknown()))
    .optional()
    .describe("An optional const that all values must match"),

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
})

export const ObjectColumnProperty = BaseObjectColumnProperty.extend({
  format: z.undefined().optional(),
})

export const ObjectColumn = BaseColumn.extend({
  type: z.literal("object"),
  property: ObjectColumnProperty,
})

export type ObjectColumn = z.infer<typeof ObjectColumn>
