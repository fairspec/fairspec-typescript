import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessArrayConstraints = FrictionlessBaseConstraints.extend({
  minLength: z.number().optional().describe("Minimum array length"),
  maxLength: z.number().optional().describe("Maximum array length"),
  jsonSchema: z
    .record(z.string(), z.any())
    .optional()
    .describe("JSON Schema object for validating array items"),
  enum: z
    .union([z.array(z.string()), z.array(z.array(z.any()))])
    .optional()
    .describe(
      "Restrict values to a specified set of arrays. Serialized as JSON strings or parsed array objects",
    ),
})

export type FrictionlessArrayConstraints = z.infer<
  typeof FrictionlessArrayConstraints
>

export const FrictionlessArrayField = FrictionlessBaseField.extend({
  type: z.literal("array").describe("Field type - discriminator property"),
  constraints: FrictionlessArrayConstraints.optional(),
})

export type FrictionlessArrayField = z.infer<typeof FrictionlessArrayField>
