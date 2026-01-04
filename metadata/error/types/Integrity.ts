import { z } from "zod"

export const IntegrityError = z.object({
  type: z.literal("integrity").describe("Error type identifier"),
  hashType: z.string().describe("The type of hash algorithm used"),
  expectedHash: z.string().describe("The expected hash value"),
  actualHash: z.string().describe("The actual hash value found"),
})

export type IntegrityError = z.infer<typeof IntegrityError>
