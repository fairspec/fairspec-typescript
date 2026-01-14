import type { Resource } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { getTableData } from "@fairspec/metadata"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import * as pl from "nodejs-polars"

export async function loadInlineTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const tableData = getTableData(resource)
  if (!tableData) {
    throw new Error("Resource data is not defined or tabular")
  }

  let table = pl.DataFrame(tableData).lazy()

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromTable(table, options)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}
