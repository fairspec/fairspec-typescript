import type { Resource } from "@fairspec/metadata"
import { getHeaderRows } from "../../../../helpers/format.ts"
import type {CsvFormat, TsvFormat} from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { prefetchFiles } from "@fairspec/dataset"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { joinHeaderRows } from "../../../../actions/table/format.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import { skipCommentRows } from "../../../../actions/table/format.ts"
import type { Table } from "../../../../models/table.ts"
import * as pl from "nodejs-polars"
import { inferCsvFormat } from "../../actions/format/infer.ts"

// TODO: Condier using sample to extract header first
// for better commentChar + headerRows/commentRows support
// (consult with the Data Package Working Group)

export async function loadCsvTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const paths = await prefetchFiles(resource)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  const csvFormat = resource.format?.type === "csv" ? resource.format : undefined
  const tsvFormat = resource.format?.type === "tsv" ? resource.format : undefined
  let format = csvFormat ?? tsvFormat

  if (!format) {
    format = await inferCsvFormat({ ...resource, data: paths[0] }, options)
  }

  const scanOptions = getScanOptions(format)
  const tables: Table[] = []
  for (const path of paths) {
    const table = pl.scanCSV(path, scanOptions)
    tables.push(table)
  }

  // There is no way to specify column names in nodejs-polars by default
  // so we have to rename `column_*` to `field*` is table doesn't have header
  let table = pl.concat(tables)
  if (!scanOptions.hasHeader) {
    table = table.rename(
      Object.fromEntries(
        table.columns.map(name => [name, name.replace("column_", "field")]),
      ),
    )
  }

  if (format) {
    table = await joinHeaderRows(table, format)
    table = skipCommentRows(table, format)
  }

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromTable(table, options)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}

function getScanOptions(format?: TsvFormat | CsvFormat) {
  const headerRows = getHeaderRows(format)

  const options: Partial<pl.ScanCsvOptions> = {
    inferSchemaLength: 0,
    truncateRaggedLines: true,
  }

  options.skipRows = headerRows[0] ? headerRows[0] - 1 : 0
  options.hasHeader = headerRows.length > 0
  options.eolChar = format?.lineTerminator ?? "\r\n"
  options.sep = format?.type === "csv" ? (format?.delimiter ?? ",") : "\t"
  options.quoteChar = format?.type === "csv" ? format?.quoteChar ?? '"' : undefined
  options.nullValues = format?.nullSequence
  options.commentPrefix = format?.commentChar

  return options
}
