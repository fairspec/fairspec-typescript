import type { DatetimeColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

// TODO: Add support for timezone handling
export function parseDatetimeColumn(column: DatetimeColumn, columnExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (column.format && column.format !== "default" && column.format !== "any") {
    format = column.format
  }

  return columnExpr.str.strptime(pl.Datetime, format)
}

export function stringifyDatetimeColumn(
  column: DatetimeColumn,
  columnExpr: pl.Expr,
) {
  const format = column.format ?? DEFAULT_FORMAT

  return columnExpr.date.strftime(format)
}
