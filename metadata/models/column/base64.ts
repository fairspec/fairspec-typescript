import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const Base64Column = BaseStringColumn.extend({
  type: z.literal("base64"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("base64"),
  }),
})

export type Base64Column = z.infer<typeof Base64Column>
