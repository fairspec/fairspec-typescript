import type { CellMinLengthError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellMinLength(column: Column, mapping: CellMapping) {
  if (column.type !== "string") return undefined

  const minLength = column.constraints?.minLength
  if (!minLength) return undefined

  const isErrorExpr = mapping.target.str.lengths().lt(minLength)

  const errorTemplate: CellMinLengthError = {
    type: "cell/minLength",
    columnName: column.name,
    minLength: minLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
