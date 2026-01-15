import type { z } from "zod"
import { JsonSchema } from "./jsonSchema.ts"

export const DataSchema = JsonSchema

export type DataSchema = z.infer<typeof DataSchema>
