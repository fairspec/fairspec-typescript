import type {
  CsvFileDialect,
  JsonFileDialect,
  JsonlFileDialect,
  OdsFileDialect,
  SqliteFileDialect,
  TsvFileDialect,
  XlsxFileDialect,
} from "@fairspec/library"
import { inferFileDialectFormat } from "@fairspec/library"
import type { FileDialectOptions } from "../models/fileDialect.ts"

export function createFileDialectFromPathAndOptions(
  path: string,
  options: FileDialectOptions,
) {
  const format = options.format ?? inferFileDialectFormat({ data: path })

  if (format === "csv" || format === "tsv") {
    const dialect: CsvFileDialect | TsvFileDialect = { format }

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
    const dialect: XlsxFileDialect | OdsFileDialect = { format }

    if (options.sheetNumber) dialect.sheetNumber = options.sheetNumber
    if (options.sheetName) dialect.sheetName = options.sheetName
    if (options.headerRows) dialect.headerRows = options.headerRows
    if (options.headerJoin) dialect.headerJoin = options.headerJoin
    if (options.commentRows) dialect.commentRows = options.commentRows
    if (options.commentPrefix) dialect.commentPrefix = options.commentPrefix

    return dialect
  }

  if (format === "json" || format === "jsonl") {
    const dialect: JsonFileDialect | JsonlFileDialect = { format }

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
    const dialect: SqliteFileDialect = { format }

    if (options.tableName) dialect.tableName = options.tableName

    return dialect
  }

  return undefined
}
