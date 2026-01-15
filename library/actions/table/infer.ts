import type { Resource } from "@fairspec/metadata"
import { resolveDialect, resolveTableSchema } from "@fairspec/metadata"
import { inferSchemaFromTable } from "@fairspec/table"
import { inferDialect } from "../dialect/index.ts"
import { loadTable } from "./load.ts"

export async function inferTable(resource: Partial<Resource>) {
  let dialect = await resolveDialect(resource.dialect)
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

  let schema = await resolveTableSchema(resource.schema)
  if (!schema) {
    schema = await inferSchemaFromTable(table)
  }

  return { dialect, schema, table }
}
