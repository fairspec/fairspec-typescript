import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessYearConstraints = FrictionlessBaseConstraints.extend({
  minimum: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Minimum allowed year"),
  maximum: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Maximum allowed year"),
  exclusiveMinimum: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Exclusive minimum year value"),
  exclusiveMaximum: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Exclusive maximum year value"),
  enum: z
    .union([z.array(z.number()), z.array(z.string())])
    .optional()
    .describe(
      "Restrict values to a specified set of years. Can be an array of numbers or strings that parse to years",
    ),
})

export type FrictionlessYearConstraints = z.infer<
  typeof FrictionlessYearConstraints
>

export const FrictionlessYearField = FrictionlessBaseField.extend({
  type: z.literal("year").describe("Field type - discriminator property"),
  constraints: FrictionlessYearConstraints.optional(),
})

export type FrictionlessYearField = z.infer<typeof FrictionlessYearField>
