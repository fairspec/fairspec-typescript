import { z } from "zod"
import { BaseFormat } from "./base.ts"

export const ParquetFormat = BaseFormat.extend({
  name: z.literal("parquet"),
})

export type ParquetFormat = z.infer<typeof ParquetFormat>
