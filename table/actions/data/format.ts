import { getHeaderRows } from "../../helpers/format.ts"
import type { DataRecord, DataRow } from "../../models/data.ts"
import type { FormatWithHeaderAndCommentRows } from "../../models/format.ts"

export function getRecordsFromRows(
  rows: DataRow[],
  format?: FormatWithHeaderAndCommentRows,
) {
  const records: DataRecord[] = []

  const header = getHeaderFromRows(rows, format)
  const content = getContentFromRows(rows, format)

  const labels = getLabelsFromHeader(header, format)
  if (!labels) {
    return records
  }

  for (const row of content) {
    const isCommentedRow = getIsCommentedRow(row, format)
    if (isCommentedRow) {
      continue
    }

    records.push(
      Object.fromEntries(labels.map((label, index) => [label, row[index]])),
    )
  }

  return records
}

function getHeaderFromRows(
  rows: DataRow[],
  format?: FormatWithHeaderAndCommentRows,
) {
  const headerRows = getHeaderRows(format)

  if (!headerRows.length) {
    const length = Math.max(...rows.map(row => row.length))
    const labels = Array.from({ length }, (_, idx) => `column${idx + 1}`)

    return [labels]
  }

  const header: DataRow[] = []
  for (const number of headerRows) {
    const row = rows[number - 1]
    if (row) {
      header.push(row)
    }
  }

  return header
}

function getContentFromRows(
  rows: DataRow[],
  format?: FormatWithHeaderAndCommentRows,
) {
  const headerRows = getHeaderRows(format)
  const commentRows = format?.commentRows ?? []
  const skipRows = headerRows[0] ? headerRows[0] - 1 : 0

  const content: DataRow[] = []
  for (const [index, row] of rows.entries()) {
    const number = index + 1

    if (number <= skipRows) {
      continue
    }

    if (headerRows.includes(number)) {
      continue
    }

    if (commentRows.includes(number)) {
      continue
    }

    const isCommentedRow = getIsCommentedRow(row, format)
    if (isCommentedRow) {
      continue
    }

    content.push(row)
  }

  return content
}

function getLabelsFromHeader(
  header: DataRow[],
  format?: FormatWithHeaderAndCommentRows,
) {
  if (!header[0]) {
    return undefined
  }

  const labels = header[0].map(String)
  const headerJoin = format?.headerJoin ?? " "

  for (const row of header.slice(1)) {
    for (const [index, label] of row.entries()) {
      const prefix = labels[index] ?? ""
      labels[index] = [prefix, label].filter(Boolean).join(headerJoin)
    }
  }

  return labels
}

function getIsCommentedRow(
  row: unknown[],
  format?: FormatWithHeaderAndCommentRows,
) {
  const commentPrefix = format?.commentPrefix
  if (!commentPrefix) {
    return false
  }

  if (typeof row[0] !== "string") {
    return false
  }

  return row[0].startsWith(commentPrefix)
}
