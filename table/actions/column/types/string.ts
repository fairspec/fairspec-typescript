import type { StringColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

const FORMAT_REGEX = {
  email:
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
  uri: "^[a-zA-Z][a-zA-Z0-9+.-]*:(//([^\\s/]+[^\\s]*|/[^\\s]*)|[^\\s/][^\\s]*)$",
  binary: "^[A-Za-z0-9+/]*={0,2}$",
  uuid: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
} as const

// TODO: support categoriesOrder?
export function parseStringColumn(column: StringColumn, columnExpr: pl.Expr) {
  const format = column.format
  const flattenCategories = column.categories?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  if (flattenCategories) {
    return pl
      .when(columnExpr.isIn(flattenCategories))
      .then(columnExpr.cast(pl.Categorical))
      .otherwise(pl.lit(null))
      .alias(column.name)
  }

  if (format) {
    const regex = FORMAT_REGEX[format]
    return pl
      .when(columnExpr.str.contains(regex))
      .then(columnExpr)
      .otherwise(pl.lit(null))
      .alias(column.name)
  }

  return columnExpr
}

export function stringifyStringColumn(_column: StringColumn, columnExpr: pl.Expr) {
  return columnExpr
}
