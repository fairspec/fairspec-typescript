import type { CategoricalColumn } from "@fairspec/metadata"
import * as pl from "nodejs-polars"

export function parseCategoricalColumn(
  column: CategoricalColumn,
  columnExpr: pl.Expr,
) {
  const { values, labels } = getValuesAndLabels(column)

  return values.length
    ? columnExpr.replaceStrict(values, labels, pl.lit(null), pl.Categorical)
    : columnExpr
}

export function stringifyCategoricalColumn(
  column: CategoricalColumn,
  columnExpr: pl.Expr,
) {
  const { values, labels } = getValuesAndLabels(column)
  const polarsType = column.property.type === "string" ? pl.String : pl.Int64

  return values.length
    ? columnExpr.replaceStrict(labels, values, pl.lit(null), polarsType)
    : columnExpr
}

function getValuesAndLabels(column: CategoricalColumn) {
  const values: (string | number)[] = []
  const labels: string[] = []

  for (const item of column.property.categories ?? []) {
    if (typeof item === "object") {
      values.push(item.value)
      labels.push(item.label)
    } else {
      values.push(item)
      labels.push(item.toString())
    }
  }

  return { values, labels }
}
