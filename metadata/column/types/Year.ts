import { z } from "zod"
import { IntegerColumn } from "./Integer.ts"

export const YearColumn = IntegerColumn.extend({
  format: z.literal("year"),
})

export type YearColumn = z.infer<typeof YearColumn>
