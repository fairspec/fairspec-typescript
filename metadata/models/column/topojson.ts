import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { ObjectColumn } from "./object.ts"

export const TopojsonColumn = BaseColumn.extend({
  type: z.literal("topojson"),
  property: ObjectColumn.shape.property.extend({
    format: z.literal("topojson"),
  }),
})

export type TopojsonColumn = z.infer<typeof TopojsonColumn>
