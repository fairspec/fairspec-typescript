import { z } from "zod"
import { StringColumn } from "./String.ts"

export const WktColumn = StringColumn.extend({
  format: z.literal("wkt"),
})

export type WktColumn = z.infer<typeof WktColumn>
