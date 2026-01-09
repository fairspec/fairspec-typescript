import * as pl from "nodejs-polars"
import type { ColumnMapping } from "../../models/column.ts"

const DEFAULT_MISSING_VALUES = [""]

export function substituteColumn(mapping: ColumnMapping, columnExpr: pl.Expr) {
  if (!mapping.source.type.equals(pl.String)) return columnExpr

  const flattenMissingValues =
    mapping.target.property.missingValues?.map(it =>
      typeof it === "object" ? it.value : it,
    ) ?? DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    columnExpr = pl
      .when(columnExpr.isIn(flattenMissingValues))
      .then(pl.lit(null))
      .otherwise(columnExpr)
      .alias(mapping.target.name)
  }

  return columnExpr
}
