import { getTempFilePath } from "@fairspec/dataset"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadOdsTable } from "./load.ts"
import { saveOdsTable } from "./save.ts"
import { readTestData } from "./test.ts"

const row1 = { id: 1, name: "english" }
const row2 = { id: 2, name: "中文" }
const table = pl.readRecords([row1, row2]).lazy()

describe("saveOdsTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    await saveOdsTable(table, { path })

    const data = await readTestData(path)
    expect(data).toEqual([row1, row2])
  })

  it("should save and load various data types", async () => {
    const path = getTempFilePath()

    const source = pl
      .DataFrame([
        pl.Series("boolean", [true], pl.Bool),
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.Date),
        pl.Series("datetime", [new Date(Date.UTC(2025, 0, 1))], pl.Datetime),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
        pl.Series("string", ["string"], pl.String),
      ])
      .lazy()

    await saveOdsTable(source, { path })

    const target = await loadOdsTable({ data: path }, { denormalized: true })
    expect((await target.collect()).toRecords()).toEqual([
      {
        boolean: true,
        date: "2025-01-01",
        datetime: "2025-01-01T00:00:00",
        integer: 1,
        number: 1.1,
        string: "string",
      },
    ])
  })
})
