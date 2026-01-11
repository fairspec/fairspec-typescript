import { z } from "zod"

export const ParquetFormat = z.object({
  type: z.literal("parquet"),
})

export type ParquetFormat = z.infer<typeof ParquetFormat>
