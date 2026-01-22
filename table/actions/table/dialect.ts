import * as pl from "nodejs-polars"
import { getHeaderRows } from "../../helpers/dialect.ts"
import type { DialectWithHeaderAndCommentRows } from "../../models/dialect.ts"
import type { Table } from "../../models/table.ts"

export async function joinHeaderRows(
  table: Table,
  dialect: DialectWithHeaderAndCommentRows,
) {
  const headerRows = getHeaderRows(dialect)
  const headerOffset = headerRows.at(0) ?? 0
  const headerJoin = dialect?.headerJoin ?? " "
  if (headerRows.length < 2) {
    return table
  }

  const extraLabelsFrame = await table
    .withRowIndex("fairspec:number", 1)
    .filter(pl.col("fairspec:number").add(headerOffset).isIn(headerRows))
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
    .withRowIndex("fairspec:number", 1)
    .filter(pl.col("fairspec:number").add(headerOffset).isIn(headerRows).not())
    .rename(mapping)
    .drop("fairspec:number")
}

export function skipCommentRows(
  table: Table,
  dialect: DialectWithHeaderAndCommentRows,
) {
  const headerRows = getHeaderRows(dialect)
  const commentOffset = headerRows.at(-1) ?? 0
  if (!dialect?.commentRows) {
    return table
  }

  return table
    .withRowIndex("fairspec:number", 1)
    .filter(
      pl
        .col("fairspec:number")
        .add(commentOffset)
        .isIn(dialect.commentRows)
        .not(),
    )
    .drop("fairspec:number")
}
