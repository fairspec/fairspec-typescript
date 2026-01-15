import type { Resource } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { inferTableSchemaFromTable } from "@fairspec/table"
import { inferFormat } from "../../actions/format/infer.ts"
import { loadTable } from "./load.ts"

export async function inferTable(resource: Partial<Resource>) {
  let format = resource.format

  if (!format) {
    format = await inferFormat(resource)
  }

  const table = await loadTable({ ...resource, format }, { denormalized: true })

  if (!table) {
    return undefined
  }

  let tableSchema = await resolveTableSchema(resource.tableSchema)
  if (!tableSchema) {
    tableSchema = await inferTableSchemaFromTable(table)
  }

  return { format, table, tableSchema }
}
