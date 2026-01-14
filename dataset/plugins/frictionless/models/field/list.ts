import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessListConstraints = FrictionlessBaseConstraints.extend({
  minLength: z.number().optional().describe("Minimum number of list items"),
  maxLength: z.number().optional().describe("Maximum number of list items"),
  enum: z
    .union([z.array(z.string()), z.array(z.array(z.any()))])
    .optional()
    .describe(
      "Restrict values to a specified set of lists. Either as delimited strings or arrays",
    ),
})

export type FrictionlessListConstraints = z.infer<
  typeof FrictionlessListConstraints
>

export const FrictionlessListField = FrictionlessBaseField.extend({
  type: z.literal("list").describe("Field type - discriminator property"),
  delimiter: z
    .string()
    .optional()
    .describe("Character used to separate values in the list"),
  itemType: z
    .enum([
      "string",
      "integer",
      "number",
      "boolean",
      "datetime",
      "date",
      "time",
    ])
    .optional()
    .describe("Type of items in the list"),
  constraints: FrictionlessListConstraints.optional(),
})

export type FrictionlessListField = z.infer<typeof FrictionlessListField>
