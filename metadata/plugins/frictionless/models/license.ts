import { z } from "zod"

export const FrictionlessLicense = z.object({
  name: z.string().optional().describe("The name of the license (e.g., \"MIT\", \"Apache-2.0\")"),
  path: z.string().optional().describe("A URL to the license text"),
  title: z.string().optional().describe("Human-readable title of the license"),
})

export type FrictionlessLicense = z.infer<typeof FrictionlessLicense>
