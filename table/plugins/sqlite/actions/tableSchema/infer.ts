import type { Resource } from "@fairspec/metadata"
import { getDataFirstPath } from "@fairspec/metadata"
import { SqliteDriver } from "../../drivers/sqlite.ts"

export async function inferTableSchemaFromSqlite(resource: Partial<Resource>) {
  const firstPath = getDataFirstPath(resource)
  if (!firstPath) {
    throw new Error("Database is not defined")
  }

  // TODO: Use first table if not defined
  const format =
    resource.format?.type === "sqlite" ? resource.format : undefined
  if (!format?.tableName) {
    throw new Error("Table name is not defined")
  }

  const driver = new SqliteDriver()
  const database = await driver.connectDatabase(firstPath)
  const databaseSchemas = await database.introspection.getTables()

  const databaseSchema = databaseSchemas.find(s => s.name === format.tableName)
  if (!databaseSchema) {
    throw new Error(`Table is not found in the database: ${format.tableName}`)
  }

  return driver.convertTableSchemaFromDatabase(databaseSchema)
}
