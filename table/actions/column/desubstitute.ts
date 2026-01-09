import type { Column } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_MISSING_VALUE = ""

export function desubstituteColumn(column: Column, columnExpr: pl.Expr) {
  const flattenMissingValues = column.property.missingValues?.map(it =>
    typeof it === "object" ? it.value : it,
  )

  const missingValue = flattenMissingValues?.[0] ?? DEFAULT_MISSING_VALUE
  columnExpr = pl
    .when(columnExpr.isNull())
    .then(pl.lit(missingValue))
    .otherwise(columnExpr)
    .alias(column.name)

  return columnExpr
}
