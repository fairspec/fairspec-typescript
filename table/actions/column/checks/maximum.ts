import type {
  CellExclusiveMaximumError,
  CellMaximumError,
  Column,
} from "@fairspec/metadata"
import type { CellMapping } from "../../../models/cell.ts"

export function createCheckCellMaximum(options?: { isExclusive?: boolean }) {
  return (column: Column, mapping: CellMapping) => {
    if (
      column.property.type !== "integer" &&
      column.property.type !== "number"
    ) {
      return undefined
    }

    const maximum = options?.isExclusive
      ? column.property.exclusiveMaximum
      : column.property.maximum
    if (maximum === undefined) return undefined

    const isErrorExpr = options?.isExclusive
      ? mapping.target.gtEq(maximum)
      : mapping.target.gt(maximum)

    const errorTemplate: CellMaximumError | CellExclusiveMaximumError = {
      type: options?.isExclusive ? "cell/exclusiveMaximum" : "cell/maximum",
      columnName: column.name,
      maximum: String(maximum),
      rowNumber: 0,
      cell: "",
    }

    return { isErrorExpr, errorTemplate }
  }
}
