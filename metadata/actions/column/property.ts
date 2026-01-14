import type { Column } from "../../models/column/column.ts"

export function getColumnProperties(columns: Column[]) {
  return Object.fromEntries(
    columns.map(column => [column.name, column.property]),
  )
}
