import type { TableSchema } from "./TableSchema.ts"

export function denormalizeTableSchema(tableSchema: TableSchema) {
  return globalThis.structuredClone(tableSchema)
}
