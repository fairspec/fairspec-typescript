import type { CellPatternError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function checkCellPattern(column: Column, mapping: CellMapping) {
  if (column.property.type !== "string") return undefined

  const pattern = column.property.pattern
  if (!pattern) return undefined

  const isErrorExpr = mapping.target.str.contains(pattern).not()

  const errorTemplate: CellPatternError = {
    type: "cell/pattern",
    columnName: column.name,
    pattern: pattern,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
