import { z } from "zod"
import { StringColumn } from "./string.ts"

export const WktColumn = StringColumn.extend({
  format: z.literal("wkt"),
})

export type WktColumn = z.infer<typeof WktColumn>
