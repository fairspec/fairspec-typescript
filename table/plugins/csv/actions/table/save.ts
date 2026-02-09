import { assertLocalPathVacant } from "@fairspec/dataset"
import { getSupportedFileDialect } from "@fairspec/metadata"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { getHeaderRows } from "../../../../helpers/dialect.ts"
import type { SaveTableOptions, Table } from "../../../../models/table.ts"

export async function saveCsvTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const resource = { data: path, fileDialect: options.fileDialect }
  const dialect = await getSupportedFileDialect(resource, ["csv", "tsv"])
  if (!dialect) {
    throw new Error("Saving options is not compatible")
  }

  const headerRows = getHeaderRows(dialect)

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
      lineTerminator: dialect.lineTerminator ?? "\n",
      quoteChar: dialect.format === "csv" ? dialect.quoteChar : undefined,
      separator: dialect.format === "csv" ? (dialect?.delimiter ?? ",") : "\t",
    })
    .collect()

  return path
}
