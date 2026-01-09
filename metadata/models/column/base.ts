import { z } from "zod"

export const BaseColumn = z.object({
  name: z.string(),
  type: z.string(),
  property: z.object({
    title: z
      .string()
      .optional()
      .describe("An optional human-readable title for the column"),

    description: z
      .string()
      .optional()
      .describe("An optional detailed description of the column"),

    rdfType: z
      .string()
      .optional()
      .describe("An optional URI for semantic type (RDF)"),
  }),
})

export type BaseColumn = z.infer<typeof BaseColumn>
