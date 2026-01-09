import type { TimeColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%H:%M:%S"

export function parseTimeColumn(column: TimeColumn, columnExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (column.format && column.format !== "default" && column.format !== "any") {
    format = column.format
  }

  return pl.pl
    .concatString([pl.pl.lit("1970-01-01T"), columnExpr], "")
    .str.strptime(pl.Datetime, `%Y-%m-%dT${format}`)
    .cast(pl.Time)
    .alias(column.name)
}

export function stringifyTimeColumn(column: TimeColumn, columnExpr: pl.Expr) {
  const format = column.format ?? DEFAULT_FORMAT

  return columnExpr.date.strftime(format)
}
