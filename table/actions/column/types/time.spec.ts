import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe("parseTimeColumn", () => {
  it.each([
    // Default format tests
    ["06:00:00", "06:00:00", {}],
    ["09:00", null, {}],
    ["3 am", null, {}],
    ["3.00", null, {}],
    ["invalid", null, {}],
    ["", null, {}],

    // Custom format tests
    ["06:00", "06:00:00", { temporalFormat: "%H:%M" }],
    ["06:50", null, { temporalFormat: "%M:%H" }],
    ["3:00 am", "03:00:00", { temporalFormat: "%H:%M" }],
    ["some night", null, { temporalFormat: "%H:%M" }],
    ["invalid", null, { temporalFormat: "%H:%M" }],
    ["", null, { temporalFormat: "%H:%M" }],
  ])("%s -> %s %o", async (cell, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()

    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "time",
          ...options,
        },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})

describe("stringifyTimeColumn", () => {
  it.each([
    // Default format
    [new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), "06:00:00", {}],
    [new Date(Date.UTC(2014, 0, 1, 16, 30, 0)), "16:30:00", {}],

    // Custom format
    [
      new Date(Date.UTC(2014, 0, 1, 6, 0, 0)),
      "06:00",
      { temporalFormat: "%H:%M" },
    ],
    [
      new Date(Date.UTC(2014, 0, 1, 16, 30, 0)),
      "16:30",
      { temporalFormat: "%H:%M" },
    ],
  ])("%s -> %s %o", async (value, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.Time)]).lazy()

    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "time",
          ...options,
        },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})
