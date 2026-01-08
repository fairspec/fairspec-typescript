import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessDurationConstraints =
  FrictionlessBaseConstraints.extend({
    minimum: z
      .string()
      .optional()
      .describe("Minimum allowed duration (ISO 8601 format)"),
    maximum: z
      .string()
      .optional()
      .describe("Maximum allowed duration (ISO 8601 format)"),
    enum: z
      .array(z.string())
      .optional()
      .describe(
        "Restrict values to a specified set of durations. Should be in ISO 8601 duration format",
      ),
  })

export type FrictionlessDurationConstraints = z.infer<
  typeof FrictionlessDurationConstraints
>

export const FrictionlessDurationField = FrictionlessBaseField.extend({
  type: z.literal("duration").describe("Field type - discriminator property"),
  constraints: FrictionlessDurationConstraints.optional(),
})

export type FrictionlessDurationField = z.infer<
  typeof FrictionlessDurationField
>
