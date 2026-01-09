import type { CellEnumError, Column } from "@fairspec/metadata"
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

export function checkCellEnum(column: Column, mapping: CellMapping) {
  if (
    column.type !== "string" &&
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

  const rawEnum = column.constraints?.enum
  if (!rawEnum) return undefined

  let isErrorExpr: pl.Expr
  try {
    const parsedEnum = parseConstraint(column, rawEnum)
    isErrorExpr = mapping.target.isIn(parsedEnum).not()
  } catch {
    isErrorExpr = pl.pl.lit(true)
  }

  const errorTemplate: CellEnumError = {
    type: "cell/enum",
    columnName: column.name,
    enum: rawEnum.map(String),
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}

function parseConstraint(column: Column, value: number[] | string[]) {
  return value.map(it => parseConstraintItem(column, it))
}

function parseConstraintItem(column: Column, value: number | string) {
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
