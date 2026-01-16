import type {
  CsvFormat,
  Format,
  JsonFormat,
  JsonlFormat,
  OdsFormat,
  TsvFormat,
  XlsxFormat,
} from "@fairspec/metadata"

function getFileExtension(path: string) {
  const match = path.match(/\.([^.]+)$/)
  return match?.[1]?.toLowerCase()
}

export function createFormatFromOptions(
  path: string | undefined,
  options: any,
): Format | undefined {
  const extension = path ? getFileExtension(path) : undefined

  if (
    extension === "csv" ||
    extension === "tsv" ||
    options.delimiter ||
    options.lineTerminator ||
    options.quoteChar ||
    options.nullSequence ||
    options.headerRows ||
    options.headerJoin ||
    options.commentRows ||
    options.commentChar ||
    options.columnNames
  ) {
    const format: CsvFormat | TsvFormat = {
      type: extension === "tsv" ? "tsv" : "csv",
    }

    if (options.delimiter) {
      format.delimiter = options.delimiter
    }

    if (options.lineTerminator) {
      format.lineTerminator = options.lineTerminator
    }

    if (options.quoteChar && format.type === "csv") {
      format.quoteChar = options.quoteChar
    }

    if (options.nullSequence) {
      format.nullSequence = options.nullSequence
    }

    if (options.headerRows !== undefined) {
      format.headerRows = options.headerRows
    }

    if (options.headerJoin) {
      format.headerJoin = options.headerJoin
    }

    if (options.commentRows) {
      format.commentRows = options.commentRows
    }

    if (options.commentChar) {
      format.commentChar = options.commentChar
    }

    if (options.columnNames) {
      format.columnNames = options.columnNames
    }

    return format
  }

  if (
    extension === "json" ||
    extension === "jsonl" ||
    options.jsonPointer ||
    options.rowType
  ) {
    const format: JsonFormat | JsonlFormat = {
      type: extension === "jsonl" ? "jsonl" : "json",
    }

    if (options.jsonPointer) {
      format.jsonPointer = options.jsonPointer
    }

    if (options.rowType) {
      format.rowType = options.rowType
    }

    if (options.headerRows !== undefined) {
      format.headerRows = options.headerRows
    }

    if (options.headerJoin) {
      format.headerJoin = options.headerJoin
    }

    if (options.commentRows) {
      format.commentRows = options.commentRows
    }

    if (options.commentChar) {
      format.commentChar = options.commentChar
    }

    if (options.columnNames) {
      format.columnNames = options.columnNames
    }

    return format
  }

  if (extension === "xlsx" || options.sheetNumber || options.sheetName) {
    const format: XlsxFormat = {
      type: "xlsx",
    }

    if (options.sheetNumber !== undefined) {
      format.sheetNumber = options.sheetNumber
    }

    if (options.sheetName) {
      format.sheetName = options.sheetName
    }

    if (options.headerRows !== undefined) {
      format.headerRows = options.headerRows
    }

    if (options.headerJoin) {
      format.headerJoin = options.headerJoin
    }

    if (options.commentRows) {
      format.commentRows = options.commentRows
    }

    if (options.commentChar) {
      format.commentChar = options.commentChar
    }

    if (options.columnNames) {
      format.columnNames = options.columnNames
    }

    return format
  }

  if (extension === "ods") {
    const format: OdsFormat = {
      type: "ods",
    }

    if (options.sheetNumber !== undefined) {
      format.sheetNumber = options.sheetNumber
    }

    if (options.sheetName) {
      format.sheetName = options.sheetName
    }

    if (options.headerRows !== undefined) {
      format.headerRows = options.headerRows
    }

    if (options.headerJoin) {
      format.headerJoin = options.headerJoin
    }

    if (options.commentRows) {
      format.commentRows = options.commentRows
    }

    if (options.commentChar) {
      format.commentChar = options.commentChar
    }

    if (options.columnNames) {
      format.columnNames = options.columnNames
    }

    return format
  }

  return undefined
}

export function createToFormatFromOptions(
  path: string | undefined,
  options: any,
): Format | undefined {
  const toOptions = {
    delimiter: options.toDelimiter,
    lineTerminator: options.toLineTerminator,
    quoteChar: options.toQuoteChar,
    nullSequence: options.toNullSequence,
    headerRows: options.toHeaderRows,
    headerJoin: options.toHeaderJoin,
    commentRows: options.toCommentRows,
    commentChar: options.toCommentChar,
    columnNames: options.toColumnNames,
    jsonPointer: options.toJsonPointer,
    rowType: options.toRowType,
    sheetNumber: options.toSheetNumber,
    sheetName: options.toSheetName,
  }

  return createFormatFromOptions(path, toOptions)
}
