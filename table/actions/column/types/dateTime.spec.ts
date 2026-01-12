import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe.skip("parseDatetimeColumn", () => {
  it.each([
    // Default format
    ["2014-01-01T06:00:00", new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), {}],
    ["2014-01-01T06:00:00Z", new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), {}],
    ["Mon 1st Jan 2014 9 am", null, {}],
    ["invalid", null, {}],
    ["", null, {}],

    // Custom formats
    [
      "21/11/2006 16:30",
      new Date(2006, 10, 21, 16, 30),
      { temporalFormat: "%d/%m/%Y %H:%M" },
    ],
    ["16:30 21/11/06", null, { temporalFormat: "%H:%M %d/%m/%y" }],
    ["invalid", null, { temporalFormat: "%d/%m/%y %H:%M" }],
    ["", null, { temporalFormat: "%d/%m/%y %H:%M" }],

    // Invalid format
    ["21/11/06 16:30", null, { temporalFormat: "invalid" }],
  ])("%s -> %s %o", async (cell, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "date-time",
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

describe("stringifyDatetimeColumn", () => {
  it.each([
    // Default format
    [new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), "2014-01-01T06:00:00", {}],
    [new Date(Date.UTC(2006, 10, 21, 16, 30, 0)), "2006-11-21T16:30:00", {}],

    // Custom format
    [
      new Date(Date.UTC(2006, 10, 21, 16, 30, 0)),
      "21/11/2006 16:30",
      { temporalFormat: "%d/%m/%Y %H:%M" },
    ],
    [
      new Date(Date.UTC(2014, 0, 1, 6, 0, 0)),
      "2014/01/01T06:00:00",
      { temporalFormat: "%Y/%m/%dT%H:%M:%S" },
    ],
  ])("%s -> %s %o", async (value, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.Datetime)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "date-time",
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
