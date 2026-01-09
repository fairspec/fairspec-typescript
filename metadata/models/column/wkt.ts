import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const WktColumn = BaseColumn.extend({
  type: z.literal("wkt"),
  property: StringColumn.shape.property.extend({
    format: z.literal("wkt"),
  }),
})

export type WktColumn = z.infer<typeof WktColumn>
