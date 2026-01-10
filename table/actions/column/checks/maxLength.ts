import type { CellMaxLengthError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function checkCellMaxLength(column: Column, mapping: CellMapping) {
  if (column.property.type !== "string") return undefined

  const maxLength = column.property.maxLength
  if (!maxLength) return undefined

  const isErrorExpr = mapping.target.str.lengths().gt(maxLength)

  const errorTemplate: CellMaxLengthError = {
    type: "cell/maxLength",
    columnName: column.name,
    maxLength: maxLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
