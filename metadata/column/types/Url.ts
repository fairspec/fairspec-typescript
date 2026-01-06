import { z } from "zod"
import { StringColumn } from "./String.ts"

export const UrlColumn = StringColumn.extend({
  format: z.literal("url"),
})

export type UrlColumn = z.infer<typeof UrlColumn>
