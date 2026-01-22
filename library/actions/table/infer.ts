import type { Resource } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { inferTableSchemaFromTable } from "@fairspec/table"
import { inferDialect } from "../../actions/dialect/infer.ts"
import { loadTable } from "./load.ts"

export async function inferTable(resource: Resource) {
  let dialect = resource.dialect

  if (!dialect) {
    dialect = await inferDialect(resource)
  }

  const table = await loadTable(
    { ...resource, dialect },
    { denormalized: true },
  )

  if (!table) {
    return undefined
  }

  let tableSchema = await resolveTableSchema(resource.tableSchema)
  if (!tableSchema) {
    tableSchema = await inferTableSchemaFromTable(table)
  }

  return { dialect, table, tableSchema }
}
