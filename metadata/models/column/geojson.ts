import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { ObjectColumn } from "./object.ts"

export const GeojsonColumn = BaseColumn.extend({
  type: z.literal("geojson"),
  property: ObjectColumn.shape.property.extend({
    format: z.literal("geojson"),
  }),
})

export type GeojsonColumn = z.infer<typeof GeojsonColumn>
