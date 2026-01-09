import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const UrlColumn = BaseColumn.extend({
  type: z.literal("url"),
  property: StringColumn.shape.property.extend({
    format: z.literal("url"),
  }),
})

export type UrlColumn = z.infer<typeof UrlColumn>
