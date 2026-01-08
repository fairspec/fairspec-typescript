import { z } from "zod"

export const ArrowFormat = z.object({
  name: z.literal("arrow"),
})

export type ArrowFormat = z.infer<typeof ArrowFormat>
