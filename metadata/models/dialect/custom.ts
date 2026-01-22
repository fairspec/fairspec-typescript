import { z } from "zod"
import { BaseDialect } from "./base.ts"

export const CustomDialect = BaseDialect.extend({
  format: z.undefined().optional(),
})

export type CustomDialect = z.infer<typeof CustomDialect>
