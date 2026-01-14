import type { CellMultipleOfError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function checkCellMultipleOf(column: Column, mapping: CellMapping) {
  if (
    column.property.type !== "integer" &&
    column.property.type !== "number" &&
    column.property.format !== "decimal"
  ) {
    return undefined
  }

  const multipleOf = column.property.multipleOf
  if (multipleOf === undefined) return undefined

  const isErrorExpr = mapping.target.modulo(multipleOf).eq(0).not()

  const errorTemplate: CellMultipleOfError = {
    type: "cell/multipleOf",
    columnName: column.name,
    multipleOf,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
