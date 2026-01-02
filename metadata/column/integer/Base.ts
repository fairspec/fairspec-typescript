import { z } from "zod"
import { BaseColumn } from "../Base.ts"

export const BaseIntegerColumn = BaseColumn.extend({
  type: z.literal("integer"),

  enum: z
    .array(z.number().int())
    .optional()
    .describe("An optional array of allowed values for the column"),

  minimum: z
    .number()
    .int()
    .optional()
    .describe("An optional minimum value constraint (inclusive)"),

  maximum: z
    .number()
    .int()
    .optional()
    .describe("An optional maximum value constraint (inclusive)"),

  exclusiveMinimum: z
    .number()
    .int()
    .optional()
    .describe("An optional minimum value constraint (exclusive)"),

  exclusiveMaximum: z
    .number()
    .int()
    .optional()
    .describe("An optional maximum value constraint (exclusive)"),

  multipleOf: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("An optional constraint that values must be a multiple of this number"),

  categories: z
    .array(
      z.union([
        z.number().int(),
        z.object({
          value: z.number().int(),
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
        z.number().int(),
        z.object({
          value: z.union([z.string(), z.number().int()]),
          label: z.string(),
        }),
      ]),
    )
    .optional()
    .describe(
      "An optional column-specific list of values that represent missing or null data",
    ),
})

export type BaseIntegerColumn = z.infer<typeof BaseIntegerColumn>
