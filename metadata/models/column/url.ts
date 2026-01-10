import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const UrlColumn = BaseStringColumn.extend({
  type: z.literal("url"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("url"),
  }),
})

export type UrlColumn = z.infer<typeof UrlColumn>
