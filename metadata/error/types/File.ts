import { z } from "zod"

export const EncodingError = z.object({
  type: z.literal("file/encoding").describe("Error type identifier"),
  expectedEncoding: z.string().describe("The expected encoding format"),
  actualEncoding: z.string().describe("The actual encoding format found"),
})

export const IntegrityError = z.object({
  type: z.literal("file/integrity").describe("Error type identifier"),
  hashType: z.string().describe("The type of hash algorithm used"),
  expectedHash: z.string().describe("The expected hash value"),
  actualHash: z.string().describe("The actual hash value found"),
})

export const FileError = z.discriminatedUnion("type", [
  EncodingError,
  IntegrityError,
])

export type EncodingError = z.infer<typeof EncodingError>
export type IntegrityError = z.infer<typeof IntegrityError>
export type FileError = z.infer<typeof FileError>
