import { getTempFilePath } from "@fairspec/dataset"
import type { SqliteDialect } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveSqliteTable } from "../../actions/table/save.ts"
import { inferTableSchemaFromSqlite } from "./infer.ts"

const dialect: SqliteDialect = { format: "sqlite", tableName: "fairspec" }

describe("inferTableSchemaFromSqlite", () => {
  it("should infer schema", async () => {
    const path = getTempFilePath()

    const source = pl
      .DataFrame([
        pl.Series("string", ["string"], pl.Utf8),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
      ])
      .lazy()

    await saveSqliteTable(source, {
      path,
      dialect,
      overwrite: true,
    })

    const schema = await inferTableSchemaFromSqlite({
      data: path,
      dialect,
    })

    expect(schema).toEqual({
      required: [],
      properties: {
        string: { type: "string" },
        integer: { type: "integer" },
        number: { type: "number" },
      },
    })
  })

  it("throws error when resource path is not defined", async () => {
    await expect(
      inferTableSchemaFromSqlite({
        dialect: { format: "sqlite", tableName: "fairspec" },
      }),
    ).rejects.toThrow("Database is not defined")
  })

  it("throws error when table name is not defined", async () => {
    await expect(
      inferTableSchemaFromSqlite({
        data: "path",
        dialect: { format: "sqlite" },
      }),
    ).rejects.toThrow("Table name is not defined")
  })
})
