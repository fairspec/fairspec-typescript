import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe("parseDateColumn", () => {
  it.each([
    // Default format
    ["2019-01-01", new Date(Date.UTC(2019, 0, 1)), {}],
    ["10th Jan 1969", null, {}],
    ["invalid", null, {}],
    ["", null, {}],

    // Custom format
    [
      "21/11/2006",
      new Date(Date.UTC(2006, 10, 21)),
      { temporalFormat: "%d/%m/%Y" },
    ],
    [
      "21/11/06 16:30",
      new Date(Date.UTC(2006, 10, 21)),
      { temporalFormat: "%d/%m/%y" },
    ],
    ["invalid", null, { temporalFormat: "%d/%m/%y" }],
    ["", null, { temporalFormat: "%d/%m/%y" }],
    [
      "2006/11/21",
      new Date(Date.UTC(2006, 10, 21)),
      { temporalFormat: "%Y/%m/%d" },
    ],

    // Invalid format
    ["21/11/06", null, { temporalFormat: "invalid" }],
  ])("%s -> %s %o", async (cell, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "date",
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

describe("stringifyDateColumn", () => {
  it.each([
    // Default format
    [new Date(Date.UTC(2019, 0, 1)), "2019-01-01", {}],
    [new Date(Date.UTC(2006, 10, 21)), "2006-11-21", {}],

    // Custom format
    [
      new Date(Date.UTC(2006, 10, 21)),
      "21/11/2006",
      { temporalFormat: "%d/%m/%Y" },
    ],
    [
      new Date(Date.UTC(2006, 10, 21)),
      "2006/11/21",
      { temporalFormat: "%Y/%m/%d" },
    ],
  ])("%s -> %s %o", async (value, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.Date)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "date",
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
