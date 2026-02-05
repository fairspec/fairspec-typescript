import { z } from "zod"

export const InferDialectOptions = z.object({
  sampleBytes: z.number().optional(),
})

export type InferDialectOptions = z.infer<typeof InferDialectOptions>
