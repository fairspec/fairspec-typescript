import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessNumberConstraints = FrictionlessBaseConstraints.extend(
  {
    minimum: z
      .union([z.number(), z.string()])
      .optional()
      .describe("Minimum allowed value"),
    maximum: z
      .union([z.number(), z.string()])
      .optional()
      .describe("Maximum allowed value"),
    exclusiveMinimum: z
      .union([z.number(), z.string()])
      .optional()
      .describe("Exclusive minimum allowed value"),
    exclusiveMaximum: z
      .union([z.number(), z.string()])
      .optional()
      .describe("Exclusive maximum allowed value"),
    enum: z
      .union([z.array(z.number()), z.array(z.string())])
      .optional()
      .describe(
        "Restrict values to a specified set. Can be an array of numbers or strings that parse to numbers",
      ),
  },
)

export type FrictionlessNumberConstraints = z.infer<
  typeof FrictionlessNumberConstraints
>

export const FrictionlessNumberField = FrictionlessBaseField.extend({
  type: z.literal("number").describe("Field type - discriminator property"),
  decimalChar: z
    .string()
    .optional()
    .describe("Character used as decimal separator"),
  groupChar: z
    .string()
    .optional()
    .describe("Character used as thousands separator"),
  bareNumber: z
    .boolean()
    .optional()
    .describe(
      "Whether number is presented without currency symbols or percent signs",
    ),
  constraints: FrictionlessNumberConstraints.optional(),
})

export type FrictionlessNumberField = z.infer<typeof FrictionlessNumberField>
