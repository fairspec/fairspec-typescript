import { z } from "zod"
import { BaseDialect } from "./base.ts"

export const UnknownDialect = BaseDialect.extend({
  format: z.string().optional(),
})

export type UnknownDialect = z.infer<typeof UnknownDialect>
