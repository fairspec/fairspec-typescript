import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const EmailColumn = BaseColumn.extend({
  type: z.literal("email"),
  property: StringColumn.shape.property.extend({
    format: z.literal("email"),
  }),
})

export type EmailColumn = z.infer<typeof EmailColumn>
