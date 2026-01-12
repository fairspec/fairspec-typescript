import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessObjectConstraints = FrictionlessBaseConstraints.extend(
  {
    minLength: z.number().optional().describe("Minimum number of properties"),
    maxLength: z.number().optional().describe("Maximum number of properties"),
    jsonSchema: z
      .record(z.string(), z.any())
      .optional()
      .describe(
        "JSON Schema object for validating the object structure and properties",
      ),
    enum: z
      .union([z.array(z.string()), z.array(z.record(z.string(), z.any()))])
      .optional()
      .describe(
        "Restrict values to a specified set of objects. Serialized as JSON strings or object literals",
      ),
  },
)

export type FrictionlessObjectConstraints = z.infer<
  typeof FrictionlessObjectConstraints
>

export const FrictionlessObjectField = FrictionlessBaseField.extend({
  type: z.literal("object").describe("Field type - discriminator property"),
  constraints: FrictionlessObjectConstraints.optional(),
})

export type FrictionlessObjectField = z.infer<typeof FrictionlessObjectField>
