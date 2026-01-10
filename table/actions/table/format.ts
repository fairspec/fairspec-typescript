import * as pl from "nodejs-polars"
import { getHeaderRows } from "../../helpers/format.ts"
import type {
  FormatWithCommentRows,
  FormatWithHeaderRows,
} from "../../models/format.ts"
import type { Table } from "../../models/table.ts"

export async function joinHeaderRows(
  table: Table,
  format: FormatWithHeaderRows,
) {
  const headerRows = getHeaderRows(format)
  const headerOffset = headerRows.at(0) ?? 0
  const headerJoin = format?.headerJoin ?? " "
  if (headerRows.length < 2) {
    return table
  }

  const extraLabelsFrame = await table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(headerOffset).isIn(headerRows))
    .select(...table.columns.map(name => pl.col(name).str.concat(headerJoin)))
    .collect()

  const labels = table.columns
  const extraLabels = extraLabelsFrame.row(0)

  const mapping = Object.fromEntries(
    labels.map((label, index) => [
      label,
      [label, extraLabels[index]].join(headerJoin),
    ]),
  )

  return table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(headerOffset).isIn(headerRows).not())
    .rename(mapping)
    .drop("row_nr")
}

export function skipCommentRows(table: Table, format: FormatWithCommentRows) {
  const headerRows = getHeaderRows(format)
  const commentOffset = headerRows.at(-1) ?? 0
  if (!format?.commentRows) {
    return table
  }

  return table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(commentOffset).isIn(format.commentRows).not())
    .drop("row_nr")
}
