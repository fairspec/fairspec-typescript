import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessIntegerConstraints =
  FrictionlessBaseConstraints.extend({
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
        "Restrict values to a specified set. Can be an array of integers or strings that parse to integers",
      ),
  })

export type FrictionlessIntegerConstraints = z.infer<
  typeof FrictionlessIntegerConstraints
>

export const FrictionlessIntegerField = FrictionlessBaseField.extend({
  type: z.literal("integer").describe("Field type - discriminator property"),
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
  categories: z
    .union([
      z.array(z.number()),
      z.array(
        z.object({
          value: z.number(),
          label: z.string(),
        }),
      ),
    ])
    .optional()
    .describe(
      "Categories for enum values. Can be an array of values or an array of {value, label} objects",
    ),
  categoriesOrdered: z
    .boolean()
    .optional()
    .describe(
      "Whether categories should be considered to have a natural order",
    ),
  constraints: FrictionlessIntegerConstraints.optional(),
})

export type FrictionlessIntegerField = z.infer<typeof FrictionlessIntegerField>
