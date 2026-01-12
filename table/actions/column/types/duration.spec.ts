import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe.skip("parseDurationColumn", () => {
  it.each([
    ["P23DT23H", "P23DT23H"],
    ["P1Y2M3DT4H5M6S", "P1Y2M3DT4H5M6S"],
    ["PT30M", "PT30M"],
    ["P1D", "P1D"],
    ["PT1H", "PT1H"],
    ["P1W", "P1W"],
    ["PT0S", "PT0S"],
    ["", null],
    ["invalid", null],
    ["23 hours", null],
  ])("default: %s -> %s", async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "duration",
        },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})

describe("stringifyDurationColumn", () => {
  it.each([
    ["P23DT23H", "P23DT23H"],
    ["P1Y2M3DT4H5M6S", "P1Y2M3DT4H5M6S"],
    ["PT30M", "PT30M"],
    ["P1D", "P1D"],
    ["PT1H", "PT1H"],
    ["P1W", "P1W"],
    ["PT0S", "PT0S"],
    [null, ""],
  ])("default: %s -> %s", async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "duration",
        },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})
