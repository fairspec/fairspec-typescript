import type { SaveTableOptions, Table } from "@fairspec/table"
import { denormalizeTable, inferTableSchemaFromTable } from "@fairspec/table"
import type { Kysely } from "kysely"
import { SqliteDriver } from "../../drivers/sqlite.ts"
import type { DatabaseSchema } from "../../models/schema.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function saveDatabaseTable(
  table: Table,
  options: SaveTableOptions,
) {
  const { path, overwrite } = options

  const format = options.format?.type === "sqlite" ? options.format : undefined
  if (!format?.tableName) {
    throw new Error("Table name is not defined")
  }

  const tableSchema =
    options.tableSchema ??
    (await inferTableSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  const driver = new SqliteDriver()
  table = await denormalizeTable(table, tableSchema, {
    nativeTypes: driver.nativeTypes,
  })

  const database = await driver.connectDatabase(path, { create: true })
  const databaseSchema = driver.convertTableSchemaToDatabase(
    tableSchema,
    format.tableName,
  )

  await defineTable(database, databaseSchema, { overwrite })
  await populateTable(database, format.tableName, table)

  return path
}

async function defineTable(
  database: Kysely<any>,
  databaseSchema: DatabaseSchema,
  options: {
    overwrite?: boolean
  },
) {
  if (options.overwrite) {
    await database.schema.dropTable(databaseSchema.name).ifExists().execute()
  }

  let query = database.schema.createTable(databaseSchema.name)

  for (const field of databaseSchema.columns) {
    // @ts-expect-error
    query = query.addColumn(field.name, field.dataType)
  }

  if (databaseSchema.primaryKey) {
    query = query.addPrimaryKeyConstraint(
      `${databaseSchema.name}_pkey`,
      // @ts-expect-error
      databaseSchema.primaryKey,
    )
  }

  await query.execute()
}

async function populateTable(
  database: Kysely<any>,
  tableName: string,
  table: Table,
) {
  let offset = 0
  const frame = await table.collect({ streaming: true })
  while (true) {
    const buffer = frame.slice(offset, offset + BUFFER_SIZE)
    offset += BUFFER_SIZE

    const records = buffer.toRecords()
    if (!records.length) {
      break
    }

    await database.insertInto(tableName).values(records).execute()
  }
}

const BUFFER_SIZE = 10_000
