import { resolveTableSchema } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
import { getDataFirstPath } from "@fairspec/metadata"
import type { Resource } from "@fairspec/metadata"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import type { LoadTableOptions } from "../../../../plugin.ts"
import * as pl from "nodejs-polars"
import { SqliteDriver } from "../../drivers/sqlite.ts"
import { inferTableSchemaFromSqlite } from "../../actions/tableSchema/infer.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadSqliteTable(
  resource: Resource,
  options?: LoadTableOptions,
) {
  const firstPath = getDataFirstPath(resource)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let dialect = await getSupportedDialect(resource, ["sqlite"])
  if (!dialect) {
    throw new Error("Resource data is not compatible")
  }

  const driver = new SqliteDriver()
  const database = await driver.connectDatabase(firstPath)
  const databaseSchemas = await database.introspection.getTables()

  const tableName =
    dialect?.tableName ??
    databaseSchemas.toSorted((a, b) => a.name.localeCompare(b.name))[0]?.name

  if (!tableName) {
    throw new Error("Table name is not defined")
  }

  const records = await database.selectFrom(tableName).selectAll().execute()
  let table = pl.DataFrame(records).lazy()

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) {
      tableSchema = await inferTableSchemaFromSqlite({...resource, dialect})
    }

    table = await normalizeTable(table, tableSchema)
  }

  return table
}
