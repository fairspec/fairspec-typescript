import { z } from "zod"

export const ParquetFormat = z.object({
  name: z.literal("parquet"),
})

export type ParquetFormat = z.infer<typeof ParquetFormat>
