import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const HexColumn = BaseStringColumn.extend({
  type: z.literal("hex"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("hex"),
  }),
})

export type HexColumn = z.infer<typeof HexColumn>
