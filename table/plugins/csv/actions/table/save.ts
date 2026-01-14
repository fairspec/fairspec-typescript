import { assertLocalPathVacant } from "@fairspec/dataset"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { getHeaderRows } from "../../../../helpers/format.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"

export async function saveCsvTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const csvFormat = options.format?.type === "csv" ? options.format : undefined
  const tsvFormat = options.format?.type === "tsv" ? options.format : undefined
  const format = csvFormat ?? tsvFormat

  const isTabs = format?.type === "tsv"
  const headerRows = getHeaderRows(format)

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const tableSchema =
    options.tableSchema ??
    (await inferTableSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, tableSchema, {
    nativeTypes: ["string"],
  })

  await table
    .sinkCSV(path, {
      maintainOrder: true,
      includeHeader: headerRows.length > 0,
      separator: csvFormat?.delimiter ?? (isTabs ? "\t" : ","),
      lineTerminator: csvFormat?.lineTerminator ?? "\r\n",
      quoteChar: csvFormat?.quoteChar ?? '"',
    })
    .collect()

  return path
}
