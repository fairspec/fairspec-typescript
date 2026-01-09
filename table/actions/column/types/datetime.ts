import type { DatetimeColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

// TODO: Add support for timezone handling
export function parseDatetimeColumn(
  column: DatetimeColumn,
  columnExpr: pl.Expr,
) {
  const format = column.property.temporalFormat ?? DEFAULT_FORMAT

  return columnExpr.str.strptime(pl.Datetime, format)
}

export function stringifyDatetimeColumn(
  column: DatetimeColumn,
  columnExpr: pl.Expr,
) {
  const format = column.property.temporalFormat ?? DEFAULT_FORMAT

  return columnExpr.date.strftime(format)
}
