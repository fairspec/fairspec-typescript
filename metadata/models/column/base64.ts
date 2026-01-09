import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const Base64Column = BaseColumn.extend({
  type: z.literal("base64"),
  property: StringColumn.shape.property.extend({
    format: z.literal("base64"),
  }),
})

export type Base64Column = z.infer<typeof Base64Column>
