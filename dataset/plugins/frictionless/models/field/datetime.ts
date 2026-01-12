import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessDatetimeConstraints =
  FrictionlessBaseConstraints.extend({
    minimum: z.string().optional().describe("Minimum allowed datetime value"),
    maximum: z.string().optional().describe("Maximum allowed datetime value"),
    exclusiveMinimum: z
      .string()
      .optional()
      .describe("Exclusive minimum datetime value"),
    exclusiveMaximum: z
      .string()
      .optional()
      .describe("Exclusive maximum datetime value"),
    enum: z
      .array(z.string())
      .optional()
      .describe(
        "Restrict values to a specified set of datetimes. Should be in string datetime format (e.g., ISO8601)",
      ),
  })

export type FrictionlessDatetimeConstraints = z.infer<
  typeof FrictionlessDatetimeConstraints
>

export const FrictionlessDatetimeField = FrictionlessBaseField.extend({
  type: z.literal("datetime").describe("Field type - discriminator property"),
  format: z
    .string()
    .optional()
    .describe(
      "Format of the datetime: default (ISO8601 format), any (flexible datetime parsing, not recommended), or custom strptime/strftime format string",
    ),
  constraints: FrictionlessDatetimeConstraints.optional(),
})

export type FrictionlessDatetimeField = z.infer<
  typeof FrictionlessDatetimeField
>
