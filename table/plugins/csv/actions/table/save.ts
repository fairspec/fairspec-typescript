import { assertLocalPathVacant } from "@fairspec/dataset"
import { getSupportedDialect } from "@fairspec/metadata"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { getHeaderRows } from "../../../../helpers/dialect.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"

export async function saveCsvTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const dialect = await getSupportedDialect(options, ["csv", "tsv"])
  if (dialect?.format !== "csv" && dialect?.format !== "tsv") {
    throw new Error("Saving options is not compatible")
  }

  const isTabs = dialect?.format === "tsv"
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
      separator: csvDialect?.delimiter ?? (isTabs ? "\t" : ","),
      lineTerminator: csvDialect?.lineTerminator ?? "\n",
      quoteChar: csvDialect?.quoteChar ?? '"',
    })
    .collect()

  return path
}
