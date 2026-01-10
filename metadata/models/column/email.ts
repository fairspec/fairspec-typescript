import { z } from "zod"
import { BaseStringColumn } from "./string.ts"

export const EmailColumn = BaseStringColumn.extend({
  type: z.literal("email"),
  property: BaseStringColumn.shape.property.extend({
    format: z.literal("email"),
  }),
})

export type EmailColumn = z.infer<typeof EmailColumn>
