import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const WktColumn = BaseStringColumn.extend({
  type: z.literal("wkt"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("wkt"),
  }),
})

export type WktColumn = z.infer<typeof WktColumn>
