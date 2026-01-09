import * as pl from "nodejs-polars"
import type { ColumnMapping } from "../../models/column.ts"

export function narrowColumn(mapping: ColumnMapping, columnExpr: pl.Expr) {
  const variant = mapping.source.type.variant

  if (mapping.target.type === "integer") {
    if (["Float32", "Float64"].includes(variant)) {
      columnExpr = pl
        .when(columnExpr.eq(columnExpr.round(0)))
        .then(columnExpr.cast(pl.Int64))
        .otherwise(pl.lit(null))
    }
  }

  return columnExpr
}
