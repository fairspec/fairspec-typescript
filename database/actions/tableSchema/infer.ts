import type { Resource } from "@fairspec/metadata"
import { getFileProtocol, getFirstDataPath } from "@fairspec/metadata"
import { createDriver } from "../../drivers/create.ts"

export async function inferDatabaseSchema(resource: Partial<Resource>) {
  const firstPath = getFirstDataPath(resource)
  if (!firstPath) {
    throw new Error("Database is not defined")
  }

  const format =
    resource.format?.type === "sqlite" ? resource.format : undefined
  if (!format?.tableName) {
    throw new Error("Table name is not defined")
  }

  const protocol = getFileProtocol(firstPath)
  const driver = createDriver(protocol)

  const database = await driver.connectDatabase(firstPath)
  const databaseSchemas = await database.introspection.getTables()

  const databaseSchema = databaseSchemas.find(s => s.name === format.tableName)
  if (!databaseSchema) {
    throw new Error(`Table is not found in the database: ${format.tableName}`)
  }

  return driver.convertTableSchemaFromDatabase(databaseSchema)
}
