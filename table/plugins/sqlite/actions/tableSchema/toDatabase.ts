import type { TableSchema } from "@fairspec/metadata"
import { getColumns } from "@fairspec/metadata"
import type { SqliteSchema } from "../../models/schema.ts"
import { convertColumnToDatabase } from "../column/toDatabase.ts"

export function convertTableSchemaToDatabase(
  tableSchema: TableSchema,
  tableName: string,
): SqliteSchema {
  const databaseSchema: SqliteSchema = {
    name: tableName,
    columns: [],
    isView: false,
  }

  const columns = getColumns(tableSchema)
  for (const column of columns) {
    // TODO: Update when required uses JSON Schema symantics
    const isNullable = !tableSchema.required?.includes(column.name)
    const databaseColumn = convertColumnToDatabase(column, isNullable)
    databaseSchema.columns.push(databaseColumn)
  }

  if (tableSchema.primaryKey) {
    databaseSchema.primaryKey = tableSchema.primaryKey
  }

  return databaseSchema
}
