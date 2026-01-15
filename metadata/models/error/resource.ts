import { z } from "zod"

export const ResourceError = z.object({
  type: z.literal("resource").describe("Error type identifier"),
  expectedDataType: z
    .enum(["data", "table"])
    .describe("The expected data type"),
})

export type ResourceError = z.infer<typeof ResourceError>
