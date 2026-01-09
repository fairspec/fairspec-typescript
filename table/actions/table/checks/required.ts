import type { Column } from "@fairspec/metadata"
import type { CellRequiredError } from "@fairspec/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellRequired(column: Column, mapping: CellMapping) {
  const required = column.constraints?.required
  if (!required) return undefined

  const isErrorExpr = mapping.target.isNull()

  const errorTemplate: CellRequiredError = {
    type: "cell/required",
    columnName: column.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
