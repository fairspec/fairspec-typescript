import type { Resource } from "@fairspec/library"
import { inferDialectFormat } from "@fairspec/library"
import type { DialectOptions } from "../models/dialect.ts"

export function createMergedDialect(
  resource: Resource,
  options: DialectOptions,
) {
  let dialect = resource.dialect

  if (!dialect) {
    const format = inferDialectFormat(resource)
    if (!format) return undefined
    dialect = { format }
  }

  if (dialect?.format === "csv" || dialect?.format === "tsv") {
    if (options.lineTerminator) dialect.lineTerminator = options.lineTerminator
    if (options.nullSequence) dialect.nullSequence = options.nullSequence
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix
    if (options.columnNames) dialect.columnNames = options.columnNames
  }

  if (dialect?.format === "csv") {
    if (options.delimiter) dialect.delimiter = options.delimiter
    if (options.quoteChar) dialect.quoteChar = options.quoteChar
  }

  if (dialect?.format === "xlsx" || dialect?.format === "ods") {
    if (options.sheetNumber) dialect.sheetNumber = options.sheetNumber
    if (options.sheetName) dialect.sheetName = options.sheetName
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix
  }

  if (dialect?.format === "json" || dialect?.format === "jsonl") {
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix
    if (options.rowType) dialect.rowType = options.rowType
  }

  if (dialect?.format === "json") {
    if (options.jsonPointer) dialect.jsonPointer = options.jsonPointer
  }

  if (dialect?.format === "sqlite") {
    if (options.tableName) dialect.tableName = options.tableName
  }

  return dialect
}
