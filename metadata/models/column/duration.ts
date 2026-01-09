import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const DurationColumn = BaseColumn.extend({
  type: z.literal("duration"),
  property: StringColumn.shape.property.extend({
    format: z.literal("duration"),
  }),
})

export type DurationColumn = z.infer<typeof DurationColumn>
