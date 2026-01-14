import type { Column, TableSchema } from "@fairspec/metadata"
import {
  composeColumn,
  getColumnProperties,
  getColumns,
} from "@fairspec/metadata"
import type { Dialect } from "kysely"
import { Kysely } from "kysely"
import { LRUCache } from "lru-cache"
import type { DatabaseColumn } from "../models/column.ts"
import type { DatabaseSchema } from "../models/schema.ts"

// We cache database connections (only works in serverfull environments)
const databases = new LRUCache<string, Kysely<any>>({
  dispose: database => database.destroy(),
  max: 10,
})

export abstract class BaseDriver {
  abstract get nativeTypes(): Column["type"][]

  async connectDatabase(path: string, options?: { create?: boolean }) {
    const cachedDatabase = databases.get(path)
    if (cachedDatabase) {
      return cachedDatabase
    }

    const dialect = await this.createDialect(path, options)
    const database = new Kysely<any>({ dialect })
    databases.set(path, new Kysely<any>({ dialect }))

    return database
  }

  abstract createDialect(
    path: string,
    options?: { create?: boolean },
  ): Promise<Dialect>

  convertTableSchemaFromToDatabase(databaseSchema: DatabaseSchema) {
    const columns: Column[] = []
    const required: string[] = []

    for (const databaseColumn of databaseSchema.columns) {
      columns.push(this.convertColumnFromToDatabase(databaseColumn))

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

  convertColumnFromToDatabase(databaseColumn: DatabaseColumn) {
    const property = this.convertColumnPropertyFromToDatabase(
      databaseColumn.dataType,
    )

    const name = databaseColumn.name
    const column = composeColumn(name, property)

    if (databaseColumn.comment) {
      column.property.description = databaseColumn.comment
    }

    return column
  }

  abstract convertColumnPropertyFromToDatabase(
    databaseType: DatabaseColumn["dataType"],
  ): Column["property"]

  convertTableSchemaToToDatabase(
    tableSchema: TableSchema,
    tableName: string,
  ): DatabaseSchema {
    const databaseSchema: DatabaseSchema = {
      name: tableName,
      columns: [],
      isView: false,
    }

    const columns = getColumns(tableSchema)
    for (const column of columns) {
      // TODO: Update when required uses JSON Schema symantics
      const isNullable = tableSchema.required?.includes(column.name)
      const databaseColumn = this.convertColumnToDatabase(column, isNullable)
      databaseSchema.columns.push(databaseColumn)
    }

    if (tableSchema.primaryKey) {
      databaseSchema.primaryKey = tableSchema.primaryKey
    }

    return databaseSchema
  }

  convertColumnToDatabase(column: Column, isNullable = true): DatabaseColumn {
    const databaseColumn: DatabaseColumn = {
      name: column.name,
      dataType: this.convertColumnTypeToDatabase(column.type),
      isNullable,
      comment: column.property.description,
      isAutoIncrementing: false,
      hasDefaultValue: false,
    }

    return databaseColumn
  }

  abstract convertColumnTypeToDatabase(
    columnType: Column["type"],
  ): DatabaseColumn["dataType"]
}
