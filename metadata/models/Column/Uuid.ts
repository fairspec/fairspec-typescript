import { z } from "zod"
import { StringColumn } from "./String.ts"

export const UuidColumn = StringColumn.extend({
  format: z.literal("uuid"),
})

export type UuidColumn = z.infer<typeof UuidColumn>
