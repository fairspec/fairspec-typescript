import { inferDialectFormat } from "@fairspec/library"
import type {
  CsvDialect,
  JsonDialect,
  JsonlDialect,
  OdsDialect,
  SqliteDialect,
  TsvDialect,
  XlsxDialect,
} from "@fairspec/metadata"
import type { DialectOptions } from "../models/dialect.ts"

export function createDialectFromPathAndOptions(
  path: string,
  options: DialectOptions,
) {
  const format = options.format ?? inferDialectFormat({ data: path })

  if (format === "csv" || format === "tsv") {
    const dialect: CsvDialect | TsvDialect = { format }

    if (options.lineTerminator) dialect.lineTerminator = options.lineTerminator
    if (options.nullSequence) dialect.nullSequence = options.nullSequence
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix
    if (options.columnNames) dialect.columnNames = options.columnNames

    if (dialect.format === "csv") {
      if (options.delimiter) dialect.delimiter = options.delimiter
      if (options.quoteChar) dialect.quoteChar = options.quoteChar
    }

    return dialect
  }

  if (format === "xlsx" || format === "ods") {
    const dialect: XlsxDialect | OdsDialect = { format }

    if (options.sheetNumber) dialect.sheetNumber = options.sheetNumber
    if (options.sheetName) dialect.sheetName = options.sheetName
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix

    return dialect
  }

  if (format === "json" || format === "jsonl") {
    const dialect: JsonDialect | JsonlDialect = { format }

    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix
    if (options.rowType) dialect.rowType = options.rowType

    if (dialect?.format === "json") {
      if (options.jsonPointer) dialect.jsonPointer = options.jsonPointer
    }

    return dialect
  }

  if (format === "sqlite") {
    const dialect: SqliteDialect = { format }

    if (options.tableName) dialect.tableName = options.tableName

    return dialect
  }

  return undefined
}
