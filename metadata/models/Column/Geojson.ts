import { z } from "zod"
import { ObjectColumn } from "./Object.ts"

export const GeojsonColumn = ObjectColumn.extend({
  format: z.literal("geojson"),
})

export type GeojsonColumn = z.infer<typeof GeojsonColumn>
