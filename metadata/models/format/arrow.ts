import { z } from "zod"

export const ArrowFormat = z.object({
  type: z.literal("arrow"),
})

export type ArrowFormat = z.infer<typeof ArrowFormat>
