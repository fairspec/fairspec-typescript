import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessTimeConstraints = FrictionlessBaseConstraints.extend({
  minimum: z.string().optional().describe("Minimum allowed time value"),
  maximum: z.string().optional().describe("Maximum allowed time value"),
  exclusiveMinimum: z
    .string()
    .optional()
    .describe("Exclusive minimum time value"),
  exclusiveMaximum: z
    .string()
    .optional()
    .describe("Exclusive maximum time value"),
  enum: z
    .array(z.string())
    .optional()
    .describe(
      'Restrict values to a specified set of times. Should be in string time format (e.g., "HH:MM:SS")',
    ),
})

export type FrictionlessTimeConstraints = z.infer<
  typeof FrictionlessTimeConstraints
>

export const FrictionlessTimeField = FrictionlessBaseField.extend({
  type: z.literal("time").describe("Field type - discriminator property"),
  format: z
    .string()
    .optional()
    .describe(
      "Format of the time: default (HH:MM:SS), any (flexible time parsing, not recommended), or custom strptime/strftime format string",
    ),
  constraints: FrictionlessTimeConstraints.optional(),
})

export type FrictionlessTimeField = z.infer<typeof FrictionlessTimeField>
