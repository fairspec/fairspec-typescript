import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const HexColumn = BaseColumn.extend({
  type: z.literal("hex"),
  property: StringColumn.shape.property.extend({
    format: z.literal("hex"),
  }),
})

export type HexColumn = z.infer<typeof HexColumn>
