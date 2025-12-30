import { loadTableSchema } from "./load.ts"
import type { Schema } from "./Schema.ts"

export async function resolveTableSchema(schema?: Schema | string) {
  if (!schema) {
    return undefined
  }

  if (typeof schema !== "string") {
    return schema
  }

  return await loadTableSchema(schema)
}
