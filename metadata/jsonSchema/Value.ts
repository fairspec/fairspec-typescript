import { z } from "zod"

export const JsonValue = z.unknown()
export type JsonValue = z.infer<typeof JsonValue>
