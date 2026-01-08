import { z } from "zod"
import { StringColumn } from "./string.ts"

export const DurationColumn = StringColumn.extend({
  format: z.literal("duration"),
})

export type DurationColumn = z.infer<typeof DurationColumn>
