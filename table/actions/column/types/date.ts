import type { DateColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%d"

export function parseDateColumn(column: DateColumn, columnExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (column.format && column.format !== "default" && column.format !== "any") {
    format = column.format
  }

  return columnExpr.str.strptime(pl.Date, format)
}

export function stringifyDateColumn(column: DateColumn, columnExpr: pl.Expr) {
  const format = column.format ?? DEFAULT_FORMAT

  return columnExpr.date.strftime(format)
}
