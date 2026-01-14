import { resolveTableSchema } from "@fairspec/metadata"
import { getFirstDataPath } from "@fairspec/metadata"
import type { Resource } from "@fairspec/metadata"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import type { LoadTableOptions } from "../../../../plugin.ts"
import * as pl from "nodejs-polars"
import { SqliteDriver } from "../../drivers/sqlite.ts"
import { inferTableSchemaFromSqlite } from "../../actions/tableSchema/infer.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadSqliteTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const firstPath = getFirstDataPath(resource)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  // TODO: Use first table if not defined
  const format = resource.format?.type === "sqlite" ? resource.format : undefined
  if (!format?.tableName) {
    throw new Error("Table name is not defined")
  }

  const driver = new SqliteDriver()
  const database = await driver.connectDatabase(firstPath)
  const records = await database.selectFrom(format.tableName).selectAll().execute()

  let table = pl.DataFrame(records).lazy()

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromSqlite(resource)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}
