import { objectEntries } from "ts-extras"
import { composeColumn } from "../../actions/column/compose.ts"
import type { Column } from "../../models/column/column.ts"
import type { TableSchema } from "../../models/tableSchema.ts"

export function getColumns(tableSchema: TableSchema) {
  const columns: Column[] = []

  for (const [name, property] of objectEntries(tableSchema.properties ?? {})) {
    const column = composeColumn(name, property)
    column.required = tableSchema.required?.includes(name)
    columns.push(column)
  }

  return columns
}
