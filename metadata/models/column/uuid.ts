import { z } from "zod"
import { StringColumn } from "./string.ts"

export const UuidColumn = StringColumn.extend({
  format: z.literal("uuid"),
})

export type UuidColumn = z.infer<typeof UuidColumn>
