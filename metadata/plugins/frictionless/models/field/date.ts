import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessDateConstraints = FrictionlessBaseConstraints.extend({
  minimum: z.string().optional().describe("Minimum allowed date value"),
  maximum: z.string().optional().describe("Maximum allowed date value"),
  exclusiveMinimum: z
    .string()
    .optional()
    .describe("Exclusive minimum date value"),
  exclusiveMaximum: z
    .string()
    .optional()
    .describe("Exclusive maximum date value"),
  enum: z
    .array(z.string())
    .optional()
    .describe(
      'Restrict values to a specified set of dates. Should be in string date format (e.g., "YYYY-MM-DD")',
    ),
})

export type FrictionlessDateConstraints = z.infer<
  typeof FrictionlessDateConstraints
>

export const FrictionlessDateField = FrictionlessBaseField.extend({
  type: z.literal("date").describe("Field type - discriminator property"),
  format: z
    .string()
    .optional()
    .describe(
      "Format of the date: default (YYYY-MM-DD), any (flexible date parsing, not recommended), or custom strptime/strftime format string",
    ),
  constraints: FrictionlessDateConstraints.optional(),
})

export type FrictionlessDateField = z.infer<typeof FrictionlessDateField>
