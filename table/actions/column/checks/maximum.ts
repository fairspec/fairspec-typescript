import type {
  CellExclusiveMaximumError,
  CellMaximumError,
  Column,
} from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseDateColumn } from "../types/date.ts"
import { parseDatetimeColumn } from "../types/datetime.ts"
import { parseIntegerColumn } from "../types/integer.ts"
import { parseNumberColumn } from "../types/number.ts"
import { parseTimeColumn } from "../types/time.ts"
import { parseYearColumn } from "../types/year.ts"
import { parseYearmonthColumn } from "../types/yearmonth.ts"

export function createCheckCellMaximum(options?: { isExclusive?: boolean }) {
  return (column: Column, mapping: CellMapping) => {
    if (
      column.type !== "integer" &&
      column.type !== "number" &&
      column.type !== "date" &&
      column.type !== "time" &&
      column.type !== "datetime" &&
      column.type !== "year" &&
      column.type !== "yearmonth"
    ) {
      return undefined
    }

    const maximum = options?.isExclusive
      ? column.constraints?.exclusiveMaximum
      : column.constraints?.maximum
    if (maximum === undefined) return undefined

    let isErrorExpr: pl.Expr
    try {
      const parsedMaximum = parseConstraint(column, maximum)
      isErrorExpr = options?.isExclusive
        ? mapping.target.gtEq(parsedMaximum)
        : mapping.target.gt(parsedMaximum)
    } catch {
      isErrorExpr = pl.pl.lit(true)
    }

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

function parseConstraint(column: Column, value: number | string) {
  if (typeof value !== "string") return value

  let expr = pl.pl.lit(value)
  if (column.type === "integer") {
    expr = parseIntegerColumn(column, expr)
  } else if (column.type === "number") {
    expr = parseNumberColumn(column, expr)
  } else if (column.type === "date") {
    expr = parseDateColumn(column, expr)
  } else if (column.type === "time") {
    expr = parseTimeColumn(column, expr)
  } else if (column.type === "datetime") {
    expr = parseDatetimeColumn(column, expr)
  } else if (column.type === "year") {
    expr = parseYearColumn(column, expr)
  } else if (column.type === "yearmonth") {
    expr = parseYearmonthColumn(column, expr)
  }

  return evaluateExpression(expr)
}
