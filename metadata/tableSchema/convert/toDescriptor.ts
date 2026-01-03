import type { Descriptor } from "../../descriptor/index.ts"
import type { TableSchema } from "../Schema.ts"

export function convertTableSchemaToDescriptor(tableSchema: TableSchema) {
  tableSchema = globalThis.structuredClone(tableSchema)
  return tableSchema as Descriptor
}
