import { z } from "zod"
import { BaseDialect } from "./base.ts"

export const ArrowDialect = BaseDialect.extend({
  format: z.literal("arrow"),
})

export type ArrowDialect = z.infer<typeof ArrowDialect>
