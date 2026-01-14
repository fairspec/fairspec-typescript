import type { Column, TableSchema } from "@fairspec/metadata"
import {
  createColumnFromProperty,
  getColumnProperties,
  getColumns,
} from "@fairspec/metadata"
import type { Dialect } from "kysely"
import { Kysely } from "kysely"
import type { SqliteColumn } from "../models/column.ts"
import type { SqliteSchema } from "../models/schema.ts"

// TODO: Split and move to actions

export abstract class BaseDriver {
  abstract get nativeTypes(): Column["type"][]

  async connectDatabase(path: string, options?: { create?: boolean }) {
    const dialect = await this.createDialect(path, options)
    const database = new Kysely<any>({ dialect })
    return database
  }

  abstract createDialect(
    path: string,
    options?: { create?: boolean },
  ): Promise<Dialect>

  convertTableSchemaFromDatabase(databaseSchema: SqliteSchema) {
    const columns: Column[] = []
    const required: string[] = []

    for (const databaseColumn of databaseSchema.columns) {
      columns.push(this.convertColumnFromDatabase(databaseColumn))

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

  convertColumnFromDatabase(databaseColumn: SqliteColumn) {
    const property = this.convertColumnPropertyFromDatabase(
      databaseColumn.dataType,
    )

    const name = databaseColumn.name
    const column = createColumnFromProperty(name, property)

    if (databaseColumn.comment) {
      column.property.description = databaseColumn.comment
    }

    return column
  }

  abstract convertColumnPropertyFromDatabase(
    databaseType: SqliteColumn["dataType"],
  ): Column["property"]

  convertTableSchemaToDatabase(
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
      const isNullable = tableSchema.required?.includes(column.name)
      const databaseColumn = this.convertColumnToDatabase(column, isNullable)
      databaseSchema.columns.push(databaseColumn)
    }

    if (tableSchema.primaryKey) {
      databaseSchema.primaryKey = tableSchema.primaryKey
    }

    return databaseSchema
  }

  convertColumnToDatabase(column: Column, isNullable = true): SqliteColumn {
    const databaseColumn: SqliteColumn = {
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
  ): SqliteColumn["dataType"]
}
