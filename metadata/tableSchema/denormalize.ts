import { copyDescriptor } from "../descriptor/index.ts"
import type { TableSchema } from "./TableSchema.ts"

export function denormalizeTableSchema(tableSchema: TableSchema) {
  return copyDescriptor(tableSchema)
}
