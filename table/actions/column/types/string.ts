import type { StringColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

export function parseStringColumn(column: StringColumn, columnExpr: pl.Expr) {
  const flattenCategories = column.property.categories?.map(it =>
    typeof it === "object" ? it.value : it,
  )

  if (flattenCategories) {
    return pl
      .when(columnExpr.isIn(flattenCategories))
      .then(columnExpr.cast(pl.Categorical))
      .otherwise(pl.lit(null))
      .alias(column.name)
  }

  return columnExpr
}
