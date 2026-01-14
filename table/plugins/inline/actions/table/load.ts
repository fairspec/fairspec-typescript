import type { Resource } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { getRecordsFromRows } from "../../../../actions/data/format.ts"
import type { LoadTableOptions } from "../../../../plugin.ts"
import type { FormatWithHeaderAndCommentRows } from "../../../../models/format.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import * as pl from "nodejs-polars"

export async function loadInlineTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const data = resource.data
  if (!Array.isArray(data)) {
    throw new Error("Resource data is not defined or tabular")
  }

  const isRows = data.every(row => Array.isArray(row))
  const records = isRows
    ? getRecordsFromRows(data, resource.format as FormatWithHeaderAndCommentRows)
    : data
  let table = pl.DataFrame(records).lazy()

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromTable(table, options)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}
