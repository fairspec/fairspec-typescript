import type {
  CellExclusiveMinimumError,
  CellMinimumError,
  Column,
} from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function createCheckCellMinimum(options?: { isExclusive?: boolean }) {
  return (column: Column, mapping: CellMapping) => {
    if (
      column.property.type !== "integer" &&
      column.property.type !== "number" &&
      column.property.format !== "decimal"
    ) {
      return undefined
    }

    const minimum = options?.isExclusive
      ? column.property.exclusiveMinimum
      : column.property.minimum
    if (minimum === undefined) return undefined

    const isErrorExpr = options?.isExclusive
      ? mapping.target.ltEq(minimum)
      : mapping.target.lt(minimum)

    const errorTemplate: CellMinimumError | CellExclusiveMinimumError = {
      type: options?.isExclusive ? "cell/exclusiveMinimum" : "cell/minimum",
      columnName: column.name,
      minimum: String(minimum),
      rowNumber: 0,
      cell: "",
    }

    return { isErrorExpr, errorTemplate }
  }
}
