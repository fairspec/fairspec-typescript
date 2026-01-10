import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const DurationColumn = BaseStringColumn.extend({
  type: z.literal("duration"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("duration"),
  }),
})

export type DurationColumn = z.infer<typeof DurationColumn>
