import { z } from "zod"
import { BaseFormat } from "./base.ts"

export const CustomFormat = BaseFormat.extend({
  type: z.undefined().optional(),
})

export type CustomFormat = z.infer<typeof CustomFormat>
