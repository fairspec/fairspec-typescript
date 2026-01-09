import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const WkbColumn = BaseColumn.extend({
  type: z.literal("wkb"),
  property: StringColumn.shape.property.extend({
    format: z.literal("wkb"),
  }),
})

export type WkbColumn = z.infer<typeof WkbColumn>
