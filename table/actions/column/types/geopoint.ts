import type { GeopointColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are within -180..180 and -90..90
// - Return null instead of list if any of the values are out of range

export function parseGeopointColumn(column: GeopointColumn, columnExpr: pl.Expr) {
  // Default format is "lon,lat" string
  const format = column.format ?? "default"

  if (format === "default") {
    columnExpr = columnExpr.str.split(",").cast(pl.List(pl.Float64))
  }

  if (format === "array") {
    columnExpr = columnExpr.str
      .replaceAll("[\\[\\]\\s]", "")
      .str.split(",")
      .cast(pl.List(pl.Float64))
  }

  if (format === "object") {
    columnExpr = pl
      .concatList([
        columnExpr.str.jsonPathMatch("$.lon").cast(pl.Float64),
        columnExpr.str.jsonPathMatch("$.lat").cast(pl.Float64),
      ])
      .alias(column.name)
  }

  return columnExpr
}

export function stringifyGeopointColumn(
  column: GeopointColumn,
  columnExpr: pl.Expr,
) {
  // Default format is "lon,lat" string
  const format = column.format ?? "default"

  if (format === "default") {
    return columnExpr.cast(pl.List(pl.String)).lst.join(",")
  }

  if (format === "array") {
    return pl
      .concatString(
        [
          pl.lit("["),
          columnExpr.lst.get(0).cast(pl.String),
          pl.lit(","),
          columnExpr.lst.get(1).cast(pl.String),
          pl.lit("]"),
        ],
        "",
      )
      .alias(column.name) as pl.Expr
  }

  if (format === "object") {
    return pl
      .concatString(
        [
          pl.lit('{"lon":'),
          columnExpr.lst.get(0).cast(pl.String),
          pl.lit(',"lat":'),
          columnExpr.lst.get(1).cast(pl.String),
          pl.lit("}"),
        ],
        "",
      )
      .alias(column.name) as pl.Expr
  }

  return columnExpr
}
