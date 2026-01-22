import type { Resource } from "@fairspec/metadata"
import { getHeaderRows } from "../../../../helpers/dialect.ts"
import type {CsvDialect, TsvDialect} from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { prefetchFiles } from "@fairspec/dataset"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { joinHeaderRows } from "../../../../actions/table/format.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import { skipCommentRows } from "../../../../actions/table/format.ts"
import type { Table } from "../../../../models/table.ts"
import * as pl from "nodejs-polars"
import { inferCsvDialect } from "../../actions/dialect/infer.ts"
import { getSupportedDialect } from "@fairspec/metadata"

// TODO: Condier using sample to extract header first
// for better commentPrefix + headerRows/commentRows support
// (consult with the Data Package Working Group)

export async function loadCsvTable(
  resource: Resource,
  options?: LoadTableOptions,
) {
  const paths = await prefetchFiles(resource)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  let dialect = await getSupportedDialect(resource, ["csv", "tsv"])
  if (!dialect) {
    dialect = await inferCsvDialect({ ...resource, data: paths[0] }, options)
  }

  if (dialect?.format !== "csv" && dialect?.format !== "tsv") {
    throw new Error("Resource data is not compatible")
  }

  const scanOptions = getScanOptions(dialect)
  const tables: Table[] = []
  for (const path of paths) {
    const table = pl.scanCSV(path, scanOptions)
    tables.push(table)
  }

  // There is no way to specify column names in nodejs-polars by default
  // so we have to rename `column_*` to `column*` is table doesn't have header
  let table = pl.concat(tables)
  if (!scanOptions.hasHeader) {
    table = table.rename(
      Object.fromEntries(
        table.columns.map(name => [name, name.replace("column_", "column")]),
      ),
    )
  }

  if (dialect) {
    table = await joinHeaderRows(table, dialect)
    table = skipCommentRows(table, dialect)
  }

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromTable(table, options)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}

function getScanOptions(dialect?: TsvDialect | CsvDialect) {
  const headerRows = getHeaderRows(dialect)

  const options: Partial<pl.ScanCsvOptions> = {
    inferSchemaLength: 0,
    truncateRaggedLines: true,
  }

  options.skipRows = headerRows[0] ? headerRows[0] - 1 : 0
  options.hasHeader = headerRows.length > 0
  options.eolChar = dialect?.lineTerminator ?? "\n"
  options.sep = dialect?.format === "csv" ? (dialect?.delimiter ?? ",") : "\t"
  options.quoteChar = dialect?.format === "csv" ? dialect?.quoteChar ?? '"' : undefined
  options.nullValues = dialect?.nullSequence
  options.commentPrefix = dialect?.commentPrefix

  return options
}
