import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe("parseCategoricalColumn (string)", () => {
  it.each([
    ["red", "red"],
    ["green", "green"],
    ["yellow", null],
  ])("%s -> %s", async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "categorical",
          categories: ["red", "green", "blue"],
        },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})

// TODO: Support integer categorical (parse currently is limited to strings)
describe.skip("parseCategoricalColumn (integer)", () => {
  it.each([
    [1, "Low"],
    [2, "High"],
    [3, null],
  ])("%s -> %s", async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.Int64)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "integer",
          format: "categorical",
          categories: [
            { value: 1, label: "Low" },
            { value: 2, label: "High" },
          ],
        },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})

describe("stringifyCategoricalColumn (string)", () => {
  it.each([
    ["red", "red"],
    ["green", "green"],
  ])("%s -> %s", async (value, expected) => {
    const table = pl
      .DataFrame([pl.Series("name", [value], pl.Categorical)])
      .lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "categorical",
          categories: ["red", "green", "blue"],
        },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})

// TODO: Support integer categorical (parse currently is limited to strings)
describe.skip("stringifyCategoricalColumn (integer)", () => {
  it.each([
    ["Low", 1],
    ["High", 2],
  ])("%s -> %s", async (value, expected) => {
    const table = pl
      .DataFrame([pl.Series("name", [value], pl.Categorical)])
      .lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "integer",
          format: "categorical",
          categories: [
            { value: 1, label: "Low" },
            { value: 2, label: "High" },
          ],
        },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})
