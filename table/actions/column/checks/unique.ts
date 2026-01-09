import type { CellUniqueError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../Mapping.ts"

// TODO: Support schema.primaryKey and schema.uniqueKeys
export function checkCellUnique(column: Column, mapping: CellMapping) {
  const unique = column.constraints?.unique
  if (!unique) return undefined

  const isErrorExpr = mapping.target
    .isNotNull()
    .and(mapping.target.isFirstDistinct().not())

  const errorTemplate: CellUniqueError = {
    type: "cell/unique",
    columnName: column.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
