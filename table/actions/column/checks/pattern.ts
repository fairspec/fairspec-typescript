import type { CellPatternError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellPattern(column: Column, mapping: CellMapping) {
  if (column.type !== "string") return undefined

  const pattern = column.constraints?.pattern
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
