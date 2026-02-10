import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inferTableSchemaFromTable } from "./infer.ts"

describe("inferTableSchemaFromTable", () => {
  it("should infer from native types", async () => {
    const table = pl
      .DataFrame({
        integer: pl.Series("integer", [1, 2], pl.Int32),
        number: [1.1, 2.2],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        integer: { type: "integer" },
        number: { type: "number" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer integers from floats", async () => {
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        count: [10.0, 20.0, 30.0],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        id: { type: "integer" },
        count: { type: "integer" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer numeric", async () => {
    const table = pl
      .DataFrame({
        name1: ["1", "2", "3"],
        name2: ["1,000", "2,000", "3,000"],
        name3: ["1.1", "2.2", "3.3"],
        name4: ["1,000.1", "2,000.2", "3,000.3"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "integer" },
        name2: { type: "integer", groupChar: "," },
        name3: { type: "number" },
        name4: { type: "number", groupChar: "," },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer numeric (commaDecimal)", async () => {
    const table = pl
      .DataFrame({
        name1: ["1.000", "2.000", "3.000"],
        name2: ["1.000,5", "2.000,5", "3.000,5"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "integer", groupChar: "." },
        name2: { type: "number", decimalChar: ",", groupChar: "." },
      },
    }

    const result = await inferTableSchemaFromTable(table, {
      commaDecimal: true,
    })

    expect(result).toEqual(tableSchema)
  })

  it("should infer numeric withText", async () => {
    const table = pl
      .DataFrame({
        integer: ["$10", "$20", "$30"],
        percent: ["10%", "20%", "30%"],
        number: ["$10.50", "$20.75", "$30.99"],
        percentNumber: ["10.5%", "20.75%", "30.99%"],
        integerGroupChar: ["$1,000", "$2,000", "$3,000"],
        numberGroupChar: ["$1,000.50", "$2,000.75", "$3,000.99"],
        european: ["€1.000,50", "€2.000,75", "€3.000,99"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        integer: { type: "integer", withText: true },
        percent: { type: "integer", withText: true },
        number: { type: "number", withText: true },
        percentNumber: { type: "number", withText: true },
        integerGroupChar: {
          type: "integer",
          groupChar: ",",
          withText: true,
        },
        numberGroupChar: { type: "number", groupChar: ",", withText: true },
        european: {
          type: "number",
          groupChar: ".",
          decimalChar: ",",
          withText: true,
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should not infer numeric withText for non-currency text", async () => {
    const table = pl
      .DataFrame({
        ordinal: ["1st", "2nd", "3rd"],
        unit: ["2d", "5h", "10m"],
        label: ["Level 5", "Level 10", "Level 15"],
        hash: ["#10", "#20", "#30"],
        mixed: ["5x", "10x", "15x"],
        word: ["abc", "def", "ghi"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        ordinal: { type: "string" },
        unit: { type: "string" },
        label: { type: "string" },
        hash: { type: "string" },
        mixed: { type: "string" },
        word: { type: "string" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer booleans", async () => {
    const table = pl
      .DataFrame({
        name1: ["true", "True", "TRUE"],
        name2: ["false", "False", "FALSE"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "boolean" },
        name2: { type: "boolean" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer objects", async () => {
    const table = pl
      .DataFrame({
        name1: ['{"a": 1}'],
        name2: ["{}"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "object" },
        name2: { type: "object" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer arrays", async () => {
    const table = pl
      .DataFrame({
        name1: ["[1,2,3]"],
        name2: ["[]"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "array" },
        name2: { type: "array" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer dates with ISO format", async () => {
    const table = pl
      .DataFrame({
        name1: ["2023-01-15", "2023-02-20", "2023-03-25"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name1: { type: "string", format: "date" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer dates with slash format", async () => {
    const table = pl
      .DataFrame({
        yearFirst: ["2023/01/15", "2023/02/20", "2023/03/25"],
        dayMonth: ["15/01/2023", "20/02/2023", "25/03/2023"],
        monthDay: ["01/15/2023", "02/20/2023", "03/25/2023"],
      })
      .lazy()

    const tableSchemaDefault: TableSchema = {
      properties: {
        yearFirst: {
          type: "string",
          format: "date",
          temporalFormat: "%Y/%m/%d",
        },
        dayMonth: {
          type: "string",
          format: "date",
          temporalFormat: "%d/%m/%Y",
        },
        monthDay: {
          type: "string",
          format: "date",
          temporalFormat: "%d/%m/%Y",
        },
      },
    }

    const tableSchemaMonthFirst: TableSchema = {
      properties: {
        yearFirst: {
          type: "string",
          format: "date",
          temporalFormat: "%Y/%m/%d",
        },
        dayMonth: {
          type: "string",
          format: "date",
          temporalFormat: "%m/%d/%Y",
        },
        monthDay: {
          type: "string",
          format: "date",
          temporalFormat: "%m/%d/%Y",
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchemaDefault)

    const monthFirstResult = await inferTableSchemaFromTable(table, {
      monthFirst: true,
    })

    expect(monthFirstResult).toEqual(tableSchemaMonthFirst)
  })

  it("should infer dates with hyphen format", async () => {
    const table = pl
      .DataFrame({
        dayMonth: ["15-01-2023", "20-02-2023", "25-03-2023"],
      })
      .lazy()

    const tableSchemaDefault: TableSchema = {
      properties: {
        dayMonth: {
          type: "string",
          format: "date",
          temporalFormat: "%d-%m-%Y",
        },
      },
    }

    const tableSchemaMonthFirst: TableSchema = {
      properties: {
        dayMonth: {
          type: "string",
          format: "date",
          temporalFormat: "%m-%d-%Y",
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchemaDefault)

    const monthFirstResult = await inferTableSchemaFromTable(table, {
      monthFirst: true,
    })

    expect(monthFirstResult).toEqual(tableSchemaMonthFirst)
  })

  it("should infer times with standard format", async () => {
    const table = pl
      .DataFrame({
        fullTime: ["14:30:45", "08:15:30", "23:59:59"],
        shortTime: ["14:30", "08:15", "23:59"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        fullTime: { type: "string", format: "time" },
        shortTime: { type: "string", format: "time", temporalFormat: "%H:%M" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer times with 12-hour format", async () => {
    const table = pl
      .DataFrame({
        fullTime: ["2:30:45 PM", "8:15:30 AM", "11:59:59 PM"],
        shortTime: ["2:30 PM", "8:15 AM", "11:59 PM"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        fullTime: {
          type: "string",
          format: "time",
          temporalFormat: "%I:%M:%S %p",
        },
        shortTime: {
          type: "string",
          format: "time",
          temporalFormat: "%I:%M %p",
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer times with timezone offset", async () => {
    const table = pl
      .DataFrame({
        name: ["14:30:45+01:00", "08:15:30-05:00", "23:59:59+00:00"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        name: { type: "string", format: "time" },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer datetimes with ISO format", async () => {
    const table = pl
      .DataFrame({
        standard: [
          "2023-01-15T14:30:45",
          "2023-02-20T08:15:30",
          "2023-03-25T23:59:59",
        ],
        utc: [
          "2023-01-15T14:30:45Z",
          "2023-02-20T08:15:30Z",
          "2023-03-25T23:59:59Z",
        ],
        withTz: [
          "2023-01-15T14:30:45+01:00",
          "2023-02-20T08:15:30-05:00",
          "2023-03-25T23:59:59+00:00",
        ],
        withSpace: [
          "2023-01-15 14:30:45",
          "2023-02-20 08:15:30",
          "2023-03-25 23:59:59",
        ],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        standard: { type: "string", format: "date-time" },
        utc: { type: "string", format: "date-time" },
        withTz: { type: "string", format: "date-time" },
        withSpace: {
          type: "string",
          format: "date-time",
          temporalFormat: "%Y-%m-%d %H:%M:%S",
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })

  it("should infer datetimes with custom formats", async () => {
    const table = pl
      .DataFrame({
        shortDayMonth: [
          "15/01/2023 14:30",
          "20/02/2023 08:15",
          "25/03/2023 23:59",
        ],
        fullDayMonth: [
          "15/01/2023 14:30:45",
          "20/02/2023 08:15:30",
          "25/03/2023 23:59:59",
        ],
        shortMonthDay: [
          "01/15/2023 14:30",
          "02/20/2023 08:15",
          "03/25/2023 23:59",
        ],
        fullMonthDay: [
          "01/15/2023 14:30:45",
          "02/20/2023 08:15:30",
          "03/25/2023 23:59:59",
        ],
      })
      .lazy()

    const tableSchemaDefault: TableSchema = {
      properties: {
        shortDayMonth: {
          type: "string",
          format: "date-time",
          temporalFormat: "%d/%m/%Y %H:%M",
        },
        fullDayMonth: {
          type: "string",
          format: "date-time",
          temporalFormat: "%d/%m/%Y %H:%M:%S",
        },
        shortMonthDay: {
          type: "string",
          format: "date-time",
          temporalFormat: "%d/%m/%Y %H:%M",
        },
        fullMonthDay: {
          type: "string",
          format: "date-time",
          temporalFormat: "%d/%m/%Y %H:%M:%S",
        },
      },
    }

    const tableSchemaMonthFirst: TableSchema = {
      properties: {
        shortDayMonth: {
          type: "string",
          format: "date-time",
          temporalFormat: "%m/%d/%Y %H:%M",
        },
        fullDayMonth: {
          type: "string",
          format: "date-time",
          temporalFormat: "%m/%d/%Y %H:%M:%S",
        },
        shortMonthDay: {
          type: "string",
          format: "date-time",
          temporalFormat: "%m/%d/%Y %H:%M",
        },
        fullMonthDay: {
          type: "string",
          format: "date-time",
          temporalFormat: "%m/%d/%Y %H:%M:%S",
        },
      },
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchemaDefault)

    const monthFirstResult = await inferTableSchemaFromTable(table, {
      monthFirst: true,
    })

    expect(monthFirstResult).toEqual(tableSchemaMonthFirst)
  })

  it("should infer lists", async () => {
    const table = pl
      .DataFrame({
        numericList: ["1.5,2.3", "4.1,5.9", "7.2,8.6"],
        integerList: ["1,2", "3,4", "5,6"],
        singleValue: ["1.5", "2.3", "4.1"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        numericList: { type: "string", format: "list", itemType: "number" },
        integerList: { type: "string", format: "list", itemType: "integer" },
        singleValue: { type: "number" },
      },
      missingValues: undefined,
    }

    const result = await inferTableSchemaFromTable(table)
    expect(result).toEqual(tableSchema)
  })
})
