import { z } from "zod"
import { StringColumn } from "./string.ts"

export const UrlColumn = StringColumn.extend({
  format: z.literal("url"),
})

export type UrlColumn = z.infer<typeof UrlColumn>
