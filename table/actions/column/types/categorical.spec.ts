import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../../actions/table/denormalize.ts"
import { normalizeTable } from "../../../actions/table/normalize.ts"

describe("parseCategoricalColumn", () => {
  it.each([
    ["red", "red", { categories: ["red", "green", "blue"] }],
    ["green", "green", { categories: ["red", "green", "blue"] }],
    [
      "1",
      "Low",
      {
        categories: [
          { value: "1", label: "Low" },
          { value: "2", label: "High" },
        ],
      },
    ],
    [
      "2",
      "High",
      {
        categories: [
          { value: "1", label: "Low" },
          { value: "2", label: "High" },
        ],
      },
    ],
    ["yellow", null, { categories: ["red", "green", "blue"] }],
    [
      "3",
      null,
      {
        categories: [
          { value: "1", label: "Low" },
          { value: "2", label: "High" },
        ],
      },
    ],
  ])("%s -> %s", async (cell, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "categorical",
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

describe("stringifyCategoricalColumn", () => {
  it.each([
    ["red", "red", { categories: ["red", "green", "blue"] }],
    ["green", "green", { categories: ["red", "green", "blue"] }],
    [
      "Low",
      "1",
      {
        categories: [
          { value: "1", label: "Low" },
          { value: "2", label: "High" },
        ],
      },
    ],
    [
      "High",
      "2",
      {
        categories: [
          { value: "1", label: "Low" },
          { value: "2", label: "High" },
        ],
      },
    ],
  ])("%s -> %s", async (value, expected, options) => {
    const table = pl
      .DataFrame([pl.Series("name", [value], pl.Categorical)])
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name: {
          type: "string",
          format: "categorical",
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
