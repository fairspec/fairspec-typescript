import type { Dataset, Resource } from "@fairspec/metadata"
import type { DatabaseProtocol } from "../../models/protocol.ts"
import { createDriver } from "../../drivers/create.ts"

export async function loadDatasetFromDatabase(
  connectionString: string,
  options: {
    protocol: DatabaseProtocol
    includeTables?: string[]
    excludeTables?: string[]
  },
) {
  const { includeTables, excludeTables } = options

  const driver = createDriver(options.protocol)
  const database = await driver.connectDatabase(connectionString)
  const databaseSchemas = await database.introspection.getTables()

  const resources: Resource[] = []
  for (const databaseSchema of databaseSchemas) {
    const name = databaseSchema.name

    if (includeTables && !includeTables.includes(name)) {
      continue
    }

    if (excludeTables?.includes(name)) {
      continue
    }

    const tableSchema = driver.convertTableSchemaFromDatabase(databaseSchema)

    resources.push({
      name,
      data: connectionString,
      format: { type: 'sqlite', tableName: name },
      tableSchema,
    })
  }

  const dataset: Dataset = {
    resources,
  }

  return dataset
}
