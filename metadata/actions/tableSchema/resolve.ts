import { loadTableSchema } from "./load.ts"
import type { TableSchema } from "./TableSchema.ts"

export async function resolveTableSchema(tableSchema?: TableSchema | string) {
  if (!tableSchema) {
    return undefined
  }

  if (typeof tableSchema !== "string") {
    return tableSchema
  }

  return await loadTableSchema(tableSchema)
}
