import type { Format } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import type { Table } from "../models/table.ts"

export async function joinHeaderRows(
  table: Table,
  options: { format: Format },
) {
  const { format } = options
  if (!("headerJoin" in format)) {
    return table
  }

  const headerOffset = getHeaderOffset(format)
  const headerRows = getHeaderRows(format)
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

export function skipCommentRows(table: Table, options: { format: Format }) {
  const { format } = options
  if (!("commentRows" in format)) {
    return table
  }

  const commentOffset = getCommentOffset(format)
  if (!format?.commentRows) {
    return table
  }

  return table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(commentOffset).isIn(format.commentRows).not())
    .drop("row_nr")
}

export function stripInitialSpace(table: Table, options: { format: Format }) {
  const { format } = options
  if (!("skipInitialSpace" in format)) {
    return table
  }

  return table.select(
    // TODO: rebase on stripCharsStart when it's fixed in polars
    // https://github.com/pola-rs/nodejs-polars/issues/336
    table.columns.map(name => pl.col(name).str.strip().as(name)),
  )
}

function getHeaderOffset(format?: Format) {
  const headerRows = getHeaderRows(format)
  return headerRows.at(0) ?? 0
}

function getHeaderRows(format?: Format) {
  return format?.headerRows ? format.headerRows : []
}

function getCommentOffset(format?: Format) {
  const headerRows = getHeaderRows(format)
  return headerRows.at(-1) ?? 0
}
