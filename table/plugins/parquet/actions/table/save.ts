import { assertLocalPathVacant } from "@fairspec/dataset"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"

export async function saveParquetTable(
  table: Table,
  options: SaveTableOptions,
) {
  const { path, overwrite } = options

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
    nativeTypes: [
      "boolean",
      "integer",
      "number",
      "string",
      "list",
      "date-time",
    ],
  })

  await table
    .sinkParquet(path, {
      maintainOrder: true,
    })
    .collect()

  return path
}
