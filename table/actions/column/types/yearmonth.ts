import type { YearmonthColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

export function parseYearmonthColumn(
  _column: YearmonthColumn,
  columnExpr: pl.Expr,
) {
  columnExpr = columnExpr.str.split("-").cast(pl.List(pl.Int16))

  return columnExpr
}

export function stringifyYearmonthColumn(
  column: YearmonthColumn,
  columnExpr: pl.Expr,
) {
  return pl
    .concatString(
      [
        columnExpr.lst.get(0).cast(pl.String).str.zFill(4),
        columnExpr.lst.get(1).cast(pl.String).str.zFill(2),
      ],
      "-",
    )
    .alias(column.name) as pl.Expr
}
