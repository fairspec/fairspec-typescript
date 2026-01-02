import { z } from "zod"
import { StringColumn } from "./String.ts"

export const WkbColumn = StringColumn.extend({
  format: z.literal("wkb"),
})

export type WkbColumn = z.infer<typeof WkbColumn>
