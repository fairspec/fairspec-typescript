import { z } from "zod"
import { BaseObjectColumn } from "./object.ts"

export const TopojsonColumn = BaseObjectColumn.extend({
  type: z.literal("topojson"),
  property: BaseObjectColumn.shape.property.extend({
    format: z.literal("topojson"),
  }),
})

export type TopojsonColumn = z.infer<typeof TopojsonColumn>
