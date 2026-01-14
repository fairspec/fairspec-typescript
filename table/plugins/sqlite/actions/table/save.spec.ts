import { getTempFilePath } from "@fairspec/dataset"
import type { SqliteFormat } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadSqliteTable } from "./load.ts"
import { saveSqliteTable } from "./save.ts"

const format: SqliteFormat = { type: "sqlite", tableName: "fairspec" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("saveSqliteTable", () => {
  const mockTable = pl.DataFrame({ col1: [1, 2, 3] }).lazy()

  it("should save/load table", async () => {
    const path = getTempFilePath()

    const source = pl.DataFrame([record1, record2]).lazy()
    await saveSqliteTable(source, {
      path,
      format,
      overwrite: true,
    })

    const target = await loadSqliteTable({ data: path, format })
    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with protocol", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = pl.DataFrame([record1, record2]).lazy()
    await saveSqliteTable(source, {
      path,
      format,
      overwrite: true,
    })

    const target = await loadSqliteTable({ data: path, format })
    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with various data types", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = pl
      .DataFrame([
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.Date),
        pl.Series("datetime", [new Date(Date.UTC(2025, 0, 1))], pl.Datetime),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
        pl.Series("string", ["string"], pl.String),
      ])
      .lazy()

    await saveSqliteTable(source, {
      path,
      format,
      overwrite: true,
    })

    const target = await loadSqliteTable(
      { data: path, format },
      { denormalized: true },
    )

    expect((await target.collect()).toRecords()).toEqual([
      {
        boolean: "true",
        date: "2025-01-01",
        datetime: "2025-01-01T00:00:00",
        integer: 1,
        number: 1.1,
        string: "string",
      },
    ])
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      saveSqliteTable(mockTable, {
        path: "test.db",
        format: { type: "sqlite" },
      }),
    ).rejects.toThrow("Table name is not defined in dialect")
  })
})
