import { z } from "zod"

export const JsonError = z.object({
  type: z.literal("json").describe("Error type identifier"),
  message: z.string().describe("The JSON parsing error message"),
  jsonPointer: z.string().describe("JSON Pointer to the location of the error"),
})

export type JsonError = z.infer<typeof JsonError>
