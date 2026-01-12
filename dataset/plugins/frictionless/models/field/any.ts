import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessAnyConstraints = FrictionlessBaseConstraints.extend({
  enum: z
    .array(z.any())
    .optional()
    .describe(
      "Restrict values to a specified set. For any field type, can be an array of any values",
    ),
})

export type FrictionlessAnyConstraints = z.infer<
  typeof FrictionlessAnyConstraints
>

export const FrictionlessAnyField = FrictionlessBaseField.extend({
  type: z
    .literal("any")
    .optional()
    .describe("Field type - discriminator property"),
  constraints: FrictionlessAnyConstraints.optional(),
})

export type FrictionlessAnyField = z.infer<typeof FrictionlessAnyField>
