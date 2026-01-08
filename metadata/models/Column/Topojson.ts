import { z } from "zod"
import { ObjectColumn } from "./Object.ts"

export const TopojsonColumn = ObjectColumn.extend({
  format: z.literal("topojson"),
})

export type TopojsonColumn = z.infer<typeof TopojsonColumn>
