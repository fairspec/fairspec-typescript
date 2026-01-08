import { z } from "zod"
import { FrictionlessBaseConstraints, FrictionlessBaseField } from "./base.ts"

export const FrictionlessStringConstraints = FrictionlessBaseConstraints.extend(
  {
    minLength: z.number().optional().describe("Minimum string length"),
    maxLength: z.number().optional().describe("Maximum string length"),
    pattern: z
      .string()
      .optional()
      .describe("Regular expression pattern to match"),
    enum: z
      .array(z.string())
      .optional()
      .describe("Restrict values to a specified set of strings"),
  },
)

export type FrictionlessStringConstraints = z.infer<
  typeof FrictionlessStringConstraints
>

export const FrictionlessStringField = FrictionlessBaseField.extend({
  type: z.literal("string").describe("Field type - discriminator property"),
  format: z
    .enum(["email", "uri", "binary", "uuid"])
    .optional()
    .describe(
      "Format of the string: email (valid email address), uri (valid URI), binary (base64 encoded string), uuid (valid UUID string)",
    ),
  categories: z
    .union([
      z.array(z.string()),
      z.array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      ),
    ])
    .optional()
    .describe(
      "Categories for enum values. Can be an array of string values or an array of {value, label} objects",
    ),
  categoriesOrdered: z
    .boolean()
    .optional()
    .describe("Whether categories should be considered to have a natural order"),
  constraints: FrictionlessStringConstraints.optional(),
})

export type FrictionlessStringField = z.infer<typeof FrictionlessStringField>
