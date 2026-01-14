import { DatabaseSync } from "node:sqlite"
import { isLocalPathExist } from "@fairspec/dataset"
import type { Column } from "@fairspec/metadata"
import type { IGenericSqlite } from "kysely-generic-sqlite"
import {
  buildQueryFn,
  GenericSqliteDialect,
  parseBigInt,
} from "kysely-generic-sqlite"
import type { SqliteColumn } from "../models/column.ts"
import { BaseDriver } from "./base.ts"

// TODO: Split and move to actions

export class SqliteDriver extends BaseDriver {
  nativeTypes = ["integer", "number", "string"] satisfies Column["type"][]

  async createDialect(path: string, options?: { create?: boolean }) {
    path = path.replace(/^sqlite:\/\//, "")

    if (!options?.create) {
      const isExist = await isLocalPathExist(path)
      if (!isExist) {
        throw new Error(`Database file "${path}" does not exist`)
      }
    }

    return createSqliteDialect(path)
  }

  convertColumnPropertyFromDatabase(
    databaseType: SqliteColumn["dataType"],
  ): Column["property"] {
    switch (databaseType.toLowerCase()) {
      case "blob":
        return { type: "string" }
      case "text":
        return { type: "string" }
      case "integer":
        return { type: "integer" }
      case "numeric":
      case "real":
        return { type: "number" }
      default:
        return {}
    }
  }

  convertColumnTypeToDatabase(
    columnType: Column["type"],
  ): SqliteColumn["dataType"] {
    switch (columnType) {
      case "boolean":
        return "integer"
      case "integer":
        return "integer"
      case "number":
        return "real"
      case "string":
        return "text"
      default:
        return "text"
    }
  }
}

// TODO: Currently, the solution is not optimal / hacky
// We need to rebase on proper sqlite dialect when it will be available
// - https://github.com/kysely-org/kysely/issues/1292
// - https://github.com/oven-sh/bun/issues/20412

export async function createSqliteDialect(path: string) {
  return new GenericSqliteDialect(() =>
    createSqliteExecutor(new DatabaseSync(path)),
  )
}

function createSqliteExecutor(db: DatabaseSync): IGenericSqlite<DatabaseSync> {
  const getStmt = (sql: string) => {
    const stmt = db.prepare(sql)
    // We change it from original to use plain numbers
    //stmt.setReadBigInts(true)
    return stmt
  }

  return {
    db,
    query: buildQueryFn({
      all: (sql, parameters = []) =>
        getStmt(sql)
          .all(...parameters)
          // We change it from original to make it work
          // (by default it returns object with null prototype which breaks polars)
          .map(row => ({ ...row })),

      run: (sql, parameters = []) => {
        const { changes, lastInsertRowid } = getStmt(sql).run(...parameters)
        return {
          insertId: parseBigInt(lastInsertRowid),
          numAffectedRows: parseBigInt(changes),
        }
      },
    }),
    close: () => db.close(),
    iterator: (isSelect, sql, parameters = []) => {
      if (!isSelect) {
        throw new Error("Only support select in stream()")
      }
      return (
        getStmt(sql)
          .iterate(...parameters) // We change it from original to make it work
          // (by default it returns object with null prototype which breaks polars)
          .map(row => ({ ...row })) as any
      )
    },
  }
}
