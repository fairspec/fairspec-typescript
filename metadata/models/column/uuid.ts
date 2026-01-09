import { z } from "zod"
import { BaseColumn } from "./base.ts"
import { StringColumn } from "./string.ts"

export const UuidColumn = BaseColumn.extend({
  type: z.literal("uuid"),
  property: StringColumn.shape.property.extend({
    format: z.literal("uuid"),
  }),
})

export type UuidColumn = z.infer<typeof UuidColumn>
