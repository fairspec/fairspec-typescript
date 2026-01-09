import type { YearColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

export function parseYearColumn(_column: YearColumn, columnExpr: pl.Expr) {
  columnExpr = pl
    .when(columnExpr.str.lengths().eq(4))
    .then(columnExpr)
    .otherwise(pl.lit(null))
    .cast(pl.Int16)

  return pl
    .when(columnExpr.gtEq(0).and(columnExpr.ltEq(9999)))
    .then(columnExpr)
    .otherwise(pl.lit(null))
}

export function stringifyYearColumn(_column: YearColumn, columnExpr: pl.Expr) {
  return columnExpr.cast(pl.String).str.zFill(4)
}
