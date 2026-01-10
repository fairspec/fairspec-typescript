import { z } from "zod"
import { BaseObjectColumn } from "./object.ts"

export const GeojsonColumn = BaseObjectColumn.extend({
  type: z.literal("geojson"),
  property: BaseObjectColumn.shape.property.extend({
    format: z.literal("geojson"),
  }),
})

export type GeojsonColumn = z.infer<typeof GeojsonColumn>
