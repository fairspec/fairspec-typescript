import { z } from "zod"

export const FrictionlessForeignKey = z.object({
  fields: z.array(z.string()).describe("Source field(s) in this schema"),
  reference: z
    .object({
      resource: z
        .string()
        .optional()
        .describe("Target resource name (optional)"),
      fields: z
        .array(z.string())
        .describe("Target field(s) in the referenced resource"),
    })
    .describe("Reference to fields in another resource"),
})

export type FrictionlessForeignKey = z.infer<typeof FrictionlessForeignKey>
