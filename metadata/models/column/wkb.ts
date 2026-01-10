import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const WkbColumn = BaseStringColumn.extend({
  type: z.literal("wkb"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("wkb"),
  }),
})

export type WkbColumn = z.infer<typeof WkbColumn>
