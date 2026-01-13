import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../actions/table/normalize.ts"

describe("substituteColumn", () => {
  it.each([
    ["-", "-"],
    ["", ""],
    ["x", null],
    ["value", "value"],
  ])('schema-level ["x"]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["x"],
      properties: {
        name: { type: "string" },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })

  it.each([
    ["-", null],
    ["", ""],
    ["x", "x"],
    ["value", "value"],
  ])('column-level ["-"]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: ["-"] },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })

  it.each([
    ["", null],
    ["-", "-"],
    ["x", "x"],
    ["value", "value"],
  ])('column-level [""]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: [""] },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })

  it.each([
    ["n/a", null],
    ["-", "-"],
    ["", ""],
    ["value", "value"],
  ])('column-level ["n/a"]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: ["n/a"] },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })

  it.each([
    ["-", null],
    ["x", null],
    ["", ""],
    ["value", "value"],
  ])('schema-level ["x"] + column-level ["-"]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["x"],
      properties: {
        name: { type: "string", missingValues: ["-"] },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })

  it.each([
    ["-", null],
    ["x", null],
    ["", ""],
    ["value", "value"],
  ])('schema-level ["-"] + column-level ["x"]: %s -> %s', async (cell, expected) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["-"],
      properties: {
        name: { type: "string", missingValues: ["x"] },
      },
    }

    const result = await normalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.getColumn("name").get(0)
    expect(actual).toEqual(expected)
  })
})
