import { z } from "zod"
import { BaseDialect } from "./base.ts"

export const ParquetDialect = BaseDialect.extend({
  format: z.literal("parquet"),
})

export type ParquetDialect = z.infer<typeof ParquetDialect>
