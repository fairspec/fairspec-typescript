import type { DurationColumn } from "@fairspec/metadata"
import type * as pl from "nodejs-polars"

// TODO: Implement inspectDurationColumn

// TODO: raise an issue on nodejs-polars repo as this is not supported yet
// So we do nothing on this column type for now
export function parseDurationColumn(
  _column: DurationColumn,
  columnExpr: pl.Expr,
) {
  return columnExpr
}

export function stringifyDurationColumn(
  _column: DurationColumn,
  columnExpr: pl.Expr,
) {
  return columnExpr
}
