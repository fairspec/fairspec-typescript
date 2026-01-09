import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { IntegerColumn } from "./integer.ts"

export const YearColumn = BaseColumn.extend({
  type: z.literal("year"),
  property: IntegerColumn.shape.property.extend({
    format: z.literal("year"),
  }),
})

export type YearColumn = z.infer<typeof YearColumn>
