import { z } from "zod"

export const EncodingError = z.object({
  type: z.literal("format/encoding").describe("Error type identifier"),
  expectedEncoding: z.string().describe("The expected encoding format"),
  actualEncoding: z.string().describe("The actual encoding format found"),
})

export const FormatError = z.discriminatedUnion("type", [EncodingError])

export type EncodingError = z.infer<typeof EncodingError>
export type FormatError = z.infer<typeof FormatError>
