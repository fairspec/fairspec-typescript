import { z } from "zod"
import { ObjectColumn } from "./object.ts"

export const GeojsonColumn = ObjectColumn.extend({
  format: z.literal("geojson"),
})

export type GeojsonColumn = z.infer<typeof GeojsonColumn>
