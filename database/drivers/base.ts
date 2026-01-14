import type { Column, Schema } from "@fairspec/metadata"
import type { Dialect } from "kysely"
import { Kysely } from "kysely"
import { LRUCache } from "lru-cache"
import type { DatabaseColumn, DatabaseType } from "../column/index.ts"
import type { DatabaseSchema } from "../schema/index.ts"

// We cache database connections (only works in serverfull environments)
const databases = new LRUCache<string, Kysely<any>>({
  dispose: database => database.destroy(),
  max: 10,
})

export abstract class BaseAdapter {
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

  normalizeSchema(databaseSchema: DatabaseSchema) {
    const schema: Schema = { columns: [] }

    for (const databaseColumn of databaseSchema.columns) {
      schema.columns.push(this.normalizeColumn(databaseColumn))
    }

    return schema
  }

  normalizeColumn(databaseColumn: DatabaseColumn) {
    const column: Column = {
      name: databaseColumn.name,
      type: this.normalizeType(databaseColumn.dataType),
    }

    if (!databaseColumn.isNullable) {
      column.constraints ??= {}
      column.constraints.required = true
    }

    if (databaseColumn.comment) {
      column.description = databaseColumn.comment
    }

    return column
  }

  abstract normalizeType(databaseType: DatabaseType): Column["type"]

  denormalizeSchema(schema: Schema, tableName: string): DatabaseSchema {
    const databaseSchema: DatabaseSchema = {
      name: tableName,
      columns: [],
      isView: false,
    }

    for (const column of schema.columns) {
      databaseSchema.columns.push(this.denormalizeColumn(column))
    }

    if (schema.primaryKey) {
      databaseSchema.primaryKey = schema.primaryKey
    }

    return databaseSchema
  }

  denormalizeColumn(column: Column): DatabaseColumn {
    const databaseColumn: DatabaseColumn = {
      name: column.name,
      dataType: this.denormalizeType(column.type),
      isNullable: !column.constraints?.required,
      comment: column.description,
      isAutoIncrementing: false,
      hasDefaultValue: false,
    }

    return databaseColumn
  }

  abstract denormalizeType(columnType: Column["type"]): DatabaseType
}
