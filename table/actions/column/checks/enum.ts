import type { CellEnumError, Column } from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function checkCellEnum(column: Column, mapping: CellMapping) {
  if (
    column.property.type !== "string" &&
    column.property.type !== "integer" &&
    column.property.type !== "number"
  ) {
    return undefined
  }

  const enumConstraint = column.property.enum
  if (!enumConstraint) return undefined

  const isErrorExpr = mapping.target.isIn(enumConstraint).not()

  const errorTemplate: CellEnumError = {
    type: "cell/enum",
    columnName: column.name,
    enum: enumConstraint.map(String),
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
