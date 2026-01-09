import type { Schema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("inspectTable (cell/minimum)", () => {
  it("should not errors for valid values", async () => {
    const table = pl
      .DataFrame({
        price: [10.5, 20.75, 30.0],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "number",
          constraints: { minimum: 5 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for invalid values", async () => {
    const table = pl
      .DataFrame({
        temperature: [20.5, 30.0, 40, 3.5],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "temperature",
          type: "number",
          constraints: { minimum: 10 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/minimum")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/minimum",
      columnName: "temperature",
      minimum: "10",
      rowNumber: 4,
      cell: "3.5",
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = pl
      .DataFrame({
        temperature: [20.5, 30.0, 10.0, 5.5],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMinimum: 10 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/exclusiveMinimum")).toHaveLength(
      2,
    )
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      columnName: "temperature",
      minimum: "10",
      rowNumber: 3,
      cell: "10",
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      columnName: "temperature",
      minimum: "10",
      rowNumber: 4,
      cell: "5.5",
    })
  })

  it("should handle minimum as string", async () => {
    const table = pl
      .DataFrame({
        price: [10.5, 20.75, 3.0],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "number",
          constraints: { minimum: "5" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "price",
        minimum: "5",
        rowNumber: 3,
        cell: "3",
      },
    ])
  })

  it("should handle exclusiveMinimum as string", async () => {
    const table = pl
      .DataFrame({
        temperature: [20.5, 10.0, 5.5],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMinimum: "10" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMinimum",
        columnName: "temperature",
        minimum: "10",
        rowNumber: 2,
        cell: "10",
      },
      {
        type: "cell/exclusiveMinimum",
        columnName: "temperature",
        minimum: "10",
        rowNumber: 3,
        cell: "5.5",
      },
    ])
  })

  it("should handle minimum as string with groupChar", async () => {
    const table = pl
      .DataFrame({
        price: ["5,000", "10,500", "2,500"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "integer",
          groupChar: ",",
          constraints: { minimum: "3,000" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "price",
        minimum: "3,000",
        rowNumber: 3,
        cell: "2,500",
      },
    ])
  })

  it("should handle minimum as string with decimalChar", async () => {
    const table = pl
      .DataFrame({
        price: ["5,5", "10,75", "2,3"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "number",
          decimalChar: ",",
          constraints: { minimum: "3,0" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "price",
        minimum: "3,0",
        rowNumber: 3,
        cell: "2,3",
      },
    ])
  })

  it("should handle minimum as string with groupChar and decimalChar", async () => {
    const table = pl
      .DataFrame({
        price: ["5.000,50", "10.500,75", "2.500,30"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "number",
          groupChar: ".",
          decimalChar: ",",
          constraints: { minimum: "3.000,00" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "price",
        minimum: "3.000,00",
        rowNumber: 3,
        cell: "2.500,30",
      },
    ])
  })

  it("should handle minimum as string with bareNumber false", async () => {
    const table = pl
      .DataFrame({
        price: ["$5.00", "$10.50", "$2.50"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "price",
          type: "number",
          bareNumber: false,
          constraints: { minimum: "$3.00" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "price",
        minimum: "$3.00",
        rowNumber: 3,
        cell: "$2.50",
      },
    ])
  })

  it("should handle minimum for date columns", async () => {
    const table = pl
      .DataFrame({
        date: ["2024-01-15", "2024-02-20", "2024-01-05"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "date",
          type: "date",
          constraints: { minimum: "2024-01-10" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "date",
        minimum: "2024-01-10",
        rowNumber: 3,
        cell: "2024-01-05",
      },
    ])
  })

  it.skip("should handle minimum for time columns", async () => {
    const table = pl
      .DataFrame({
        time: ["14:30:00", "16:45:00", "12:15:00"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "time",
          type: "time",
          constraints: { minimum: "13:00:00" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "time",
        minimum: "13:00:00",
        rowNumber: 3,
        cell: "12:15:00",
      },
    ])
  })

  it("should handle minimum for datetime columns", async () => {
    const table = pl
      .DataFrame({
        timestamp: [
          "2024-01-15T14:30:00",
          "2024-02-20T08:15:00",
          "2024-01-10T10:00:00",
        ],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "timestamp",
          type: "datetime",
          constraints: { minimum: "2024-01-15T00:00:00" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "timestamp",
        minimum: "2024-01-15T00:00:00",
        rowNumber: 3,
        cell: "2024-01-10T10:00:00",
      },
    ])
  })

  it("should handle minimum for date columns with custom format", async () => {
    const table = pl
      .DataFrame({
        date: ["15/01/2024", "20/02/2024", "05/01/2024"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "date",
          type: "date",
          format: "%d/%m/%Y",
          constraints: { minimum: "10/01/2024" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "date",
        minimum: "10/01/2024",
        rowNumber: 3,
        cell: "05/01/2024",
      },
    ])
  })

  it("should handle minimum for year columns", async () => {
    const table = pl
      .DataFrame({
        year: ["2020", "2021", "2018"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "year",
          type: "year",
          constraints: { minimum: "2019" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "year",
        minimum: "2019",
        rowNumber: 3,
        cell: "2018",
      },
    ])
  })

  it("should handle exclusiveMinimum for year columns", async () => {
    const table = pl
      .DataFrame({
        year: ["2020", "2021", "2019", "2018"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "year",
          type: "year",
          constraints: { exclusiveMinimum: "2019" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMinimum",
        columnName: "year",
        minimum: "2019",
        rowNumber: 3,
        cell: "2019",
      },
      {
        type: "cell/exclusiveMinimum",
        columnName: "year",
        minimum: "2019",
        rowNumber: 4,
        cell: "2018",
      },
    ])
  })

  it.skip("should handle minimum for yearmonth columns", async () => {
    const table = pl
      .DataFrame({
        yearmonth: ["2024-03", "2024-05", "2024-01"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "yearmonth",
          type: "yearmonth",
          constraints: { minimum: "2024-02" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        columnName: "yearmonth",
        minimum: "2024-02",
        rowNumber: 3,
        cell: "2024-01",
      },
    ])
  })

  it.skip("should handle exclusiveMinimum for yearmonth columns", async () => {
    const table = pl
      .DataFrame({
        yearmonth: ["2024-03", "2024-05", "2024-02", "2024-01"],
      })
      .lazy()

    const schema: Schema = {
      columns: [
        {
          name: "yearmonth",
          type: "yearmonth",
          constraints: { exclusiveMinimum: "2024-02" },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMinimum",
        columnName: "yearmonth",
        minimum: "2024-02",
        rowNumber: 3,
        cell: "2024-02",
      },
      {
        type: "cell/exclusiveMinimum",
        columnName: "yearmonth",
        minimum: "2024-02",
        rowNumber: 4,
        cell: "2024-01",
      },
    ])
  })
})
