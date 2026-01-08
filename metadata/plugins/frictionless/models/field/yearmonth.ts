import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessYearmonthConstraints =
  FrictionlessBaseConstraints.extend({
    minimum: z
      .string()
      .optional()
      .describe("Minimum allowed yearmonth value (format: YYYY-MM)"),
    maximum: z
      .string()
      .optional()
      .describe("Maximum allowed yearmonth value (format: YYYY-MM)"),
    exclusiveMinimum: z
      .string()
      .optional()
      .describe("Exclusive minimum yearmonth value"),
    exclusiveMaximum: z
      .string()
      .optional()
      .describe("Exclusive maximum yearmonth value"),
    enum: z
      .array(z.string())
      .optional()
      .describe(
        'Restrict values to a specified set of yearmonths. Should be in string format (e.g., "YYYY-MM")',
      ),
  })

export type FrictionlessYearmonthConstraints = z.infer<
  typeof FrictionlessYearmonthConstraints
>

export const FrictionlessYearmonthField = FrictionlessBaseField.extend({
  type: z.literal("yearmonth").describe("Field type - discriminator property"),
  constraints: FrictionlessYearmonthConstraints.optional(),
})

export type FrictionlessYearmonthField = z.infer<
  typeof FrictionlessYearmonthField
>
