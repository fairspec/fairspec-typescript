import { z } from "zod"
import { StringColumn } from "./String.ts"

export const HexColumn = StringColumn.extend({
  format: z.literal("hex"),
})

export type HexColumn = z.infer<typeof HexColumn>
