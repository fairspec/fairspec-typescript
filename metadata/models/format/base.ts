import { z } from "zod"

export const BaseFormat = z.object({
  title: z
    .string()
    .optional()
    .describe("An optional human-readable title of the format"),

  description: z
    .string()
    .optional()
    .describe("An optional detailed description of the format"),
})

export type BaseFormat = z.infer<typeof BaseFormat>
