import { z } from "zod"
import { StringColumn } from "./String.ts"

export const Base64Column = StringColumn.extend({
  format: z.literal("base64"),
})

export type Base64Column = z.infer<typeof Base64Column>
