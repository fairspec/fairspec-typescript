import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../../actions/table/denormalize.ts"

describe("desubstituteColumn", () => {
  it.each([
    [null, ""],
    ["hello", "hello"],
    ["value", "value"],
  ])("no missing values: %s -> %s", async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string" },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, ""],
    ["hello", "hello"],
    ["value", "value"],
  ])("schema-level empty array: %s -> %s", async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: [],
      properties: {
        name: { type: "string" },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "-"],
    ["hello", "hello"],
    ["value", "value"],
  ])('schema-level ["-"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["-"],
      properties: {
        name: { type: "string" },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "x"],
    ["hello", "hello"],
    ["value", "value"],
  ])('schema-level ["x"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["x"],
      properties: {
        name: { type: "string" },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "-"],
    ["test", "test"],
    ["value", "value"],
  ])('column-level ["-"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: ["-"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "n/a"],
    ["value", "value"],
    ["test", "test"],
  ])('column-level ["n/a"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: ["n/a"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "-"],
    ["hello", "hello"],
    ["value", "value"],
  ])('schema-level ["x"] + column-level ["-"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["x"],
      properties: {
        name: { type: "string", missingValues: ["-"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "x"],
    ["hello", "hello"],
    ["value", "value"],
  ])('schema-level ["-"] + column-level ["x"]: %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["-"],
      properties: {
        name: { type: "string", missingValues: ["x"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "-"],
    ["value", "value"],
    ["test", "test"],
  ])('column-level ["-", "n/a", "null"] (uses first): %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", missingValues: ["-", "n/a", "null"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "n/a"],
    ["value", "value"],
    ["test", "test"],
  ])('schema-level ["n/a", "NULL", ""] (uses first): %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: ["n/a", "NULL", ""],
      properties: {
        name: { type: "string" },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })

  it.each([
    [null, "-"],
    ["value", "value"],
    ["test", "test"],
  ])('column-level ["-"] + schema-level [""] (column takes precedence): %s -> %s', async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()
    const tableSchema: TableSchema = {
      missingValues: [""],
      properties: {
        name: { type: "string", missingValues: ["-"] },
      },
    }

    const result = await denormalizeTable(table, tableSchema)
    const frame = await result.collect()

    const actual = frame.toRecords()[0]?.name
    expect(actual).toEqual(expected)
  })
})
