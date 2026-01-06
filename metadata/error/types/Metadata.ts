import { z } from "zod"

export const MetadataError = z.object({
  type: z.literal("metadata").describe("Error type identifier"),
  message: z.string().describe("The JSON parsing error message"),
  jsonPointer: z.string().describe("JSON Pointer to the location of the error"),
})

export type MetadataError = z.infer<typeof MetadataError>
