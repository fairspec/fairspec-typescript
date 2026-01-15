import { z } from "zod"

export const ResourceMissingError = z.object({
  type: z.literal("resource/missing").describe("Error type identifier"),
  resourceName: z.string().describe("The name of the missing resource"),
})

export const ResourceTypeError = z.object({
  type: z.literal("resource/type").describe("Error type identifier"),
  expectedResourceType: z
    .enum(["data", "table"])
    .describe("The expected data type"),
})

export const ResourceError = z.discriminatedUnion("type", [
  ResourceMissingError,
  ResourceTypeError,
])

export type ResourceMissingError = z.infer<typeof ResourceMissingError>
export type ResourceTypeError = z.infer<typeof ResourceTypeError>
export type ResourceError = z.infer<typeof ResourceError>
