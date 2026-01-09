import type {
  Base64Column,
  EmailColumn,
  HexColumn,
  StringColumn,
  UrlColumn,
} from "@fairspec/metadata"
import * as pl from "nodejs-polars"

export function parseStringColumn(
  column: StringColumn | Base64Column | HexColumn | EmailColumn | UrlColumn,
  columnExpr: pl.Expr,
  options: {
    regex?: RegExp
  },
) {
  const regex = options?.regex
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

  if (regex) {
    return pl
      .when(columnExpr.str.contains(regex))
      .then(columnExpr)
      .otherwise(pl.lit(null))
      .alias(column.name)
  }

  return columnExpr
}
