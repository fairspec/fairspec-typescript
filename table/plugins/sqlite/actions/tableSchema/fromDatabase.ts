import type { Column } from "@fairspec/metadata"
import { getColumnProperties } from "@fairspec/metadata"
import type { SqliteSchema } from "../../models/schema.ts"
import { convertColumnFromDatabase } from "../column/fromDatabase.ts"

export function convertTableSchemaFromDatabase(databaseSchema: SqliteSchema) {
  const columns: Column[] = []
  const required: string[] = []

  for (const databaseColumn of databaseSchema.columns) {
    columns.push(convertColumnFromDatabase(databaseColumn))

    // TODO: Update when required uses JSON Schema symantics
    if (!databaseColumn.isNullable) {
      required.push(databaseColumn.name)
    }
  }

  return {
    properties: getColumnProperties(columns),
    primaryKey: databaseSchema.primaryKey,
    required,
  }
}
