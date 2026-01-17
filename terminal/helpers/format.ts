import type { Resource } from "@fairspec/library"
import { inferFormatName } from "@fairspec/library"
import type { FormatOptions } from "../models/format.ts"

export function createMergedFormat(resource: Resource, options: FormatOptions) {
  let format = resource.format

  if (!format) {
    const name = inferFormatName(resource)
    if (!name) return undefined
    format = { name }
  }

  if (format?.name === "csv" || format?.name === "tsv") {
    if (options.lineTerminator) format.lineTerminator = options.lineTerminator
    if (options.nullSequence) format.nullSequence = options.nullSequence
    if (options.headerRows !== false)
      format.headerRows = options.headerRows ?? []
    if (options.headerJoin) format.headerJoin = options.headerJoin
    if (options.commentRows) format.commentRows = options.commentRows
    if (options.commentChar) format.commentChar = options.commentChar
    if (options.columnNames) format.columnNames = options.columnNames
  }

  if (format?.name === "csv") {
    if (options.delimiter) format.delimiter = options.delimiter
    if (options.quoteChar) format.quoteChar = options.quoteChar
  }

  if (format?.name === "xlsx" || format?.name === "ods") {
    if (options.sheetNumber) format.sheetNumber = options.sheetNumber
    if (options.sheetName) format.sheetName = options.sheetName
    if (options.headerRows !== false)
      format.headerRows = options.headerRows ?? []
    if (options.headerJoin) format.headerJoin = options.headerJoin
    if (options.commentRows) format.commentRows = options.commentRows
    if (options.commentChar) format.commentChar = options.commentChar
  }

  if (format?.name === "json" || format?.name === "jsonl") {
    if (options.rowType) format.rowType = options.rowType
  }

  if (format?.name === "json") {
    if (options.jsonPointer) format.jsonPointer = options.jsonPointer
  }

  if (format?.name === "sqlite") {
    if (options.tableName) format.tableName = options.tableName
  }

  return format
}
