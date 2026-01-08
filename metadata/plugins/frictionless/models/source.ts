import { z } from "zod"

export const FrictionlessSource = z.object({
  title: z.string().optional().describe("Human-readable title of the source"),
  path: z.string().optional().describe("URL or path to the source"),
  email: z.string().optional().describe("Email contact for the source"),
})

export type FrictionlessSource = z.infer<typeof FrictionlessSource>
