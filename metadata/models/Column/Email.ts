import { z } from "zod"
import { StringColumn } from "./String.ts"

export const EmailColumn = StringColumn.extend({
  format: z.literal("email"),
})

export type EmailColumn = z.infer<typeof EmailColumn>
