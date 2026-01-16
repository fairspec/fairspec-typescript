import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../../actions/table/inspect.ts"

describe("inspectTable (cell/minLength)", () => {
  it("should not errors for string values that meet the minLength constraint", async () => {
    const table = pl
      .DataFrame({
        code: ["A123", "B456", "C789"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        code: {
          type: "string",
          minLength: 3,
        },
      },
    }

    const errors = await inspectTable(table, { tableSchema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too short", async () => {
    const table = pl
      .DataFrame({
        username: ["bob", "a", "christopher", "ab"],
      })
      .lazy()

    const tableSchema: TableSchema = {
      properties: {
        username: {
          type: "string",
          minLength: 3,
        },
      },
    }

    const errors = await inspectTable(table, { tableSchema })
    expect(
      errors.filter((e: { type: string }) => e.type === "cell/minLength"),
    ).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/minLength",
      columnName: "username",
      minLength: 3,
      rowNumber: 2,
      cell: "a",
    })
    expect(errors).toContainEqual({
      type: "cell/minLength",
      columnName: "username",
      minLength: 3,
      rowNumber: 4,
      cell: "ab",
    })
  })
})
