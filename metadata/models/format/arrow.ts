import { z } from "zod"
import { BaseFormat } from "./base.ts"

export const ArrowFormat = BaseFormat.extend({
  type: z.literal("arrow"),
})

export type ArrowFormat = z.infer<typeof ArrowFormat>
