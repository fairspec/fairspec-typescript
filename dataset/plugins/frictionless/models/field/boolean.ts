import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessBooleanConstraints =
  FrictionlessBaseConstraints.extend({
    enum: z
      .union([z.array(z.boolean()), z.array(z.string())])
      .optional()
      .describe(
        "Restrict values to a specified set. Can be an array of booleans or strings that parse to booleans",
      ),
  })

export type FrictionlessBooleanConstraints = z.infer<
  typeof FrictionlessBooleanConstraints
>

export const FrictionlessBooleanField = FrictionlessBaseField.extend({
  type: z.literal("boolean").describe("Field type - discriminator property"),
  trueValues: z
    .array(z.string())
    .optional()
    .describe("Values that represent true"),
  falseValues: z
    .array(z.string())
    .optional()
    .describe("Values that represent false"),
  constraints: FrictionlessBooleanConstraints.optional(),
})

export type FrictionlessBooleanField = z.infer<typeof FrictionlessBooleanField>
