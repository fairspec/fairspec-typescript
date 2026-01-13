import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../../actions/table/inspect.ts"

describe("inspectTable (cell/required)", () => {
  it("should report a cell/required error", async () => {
    const table = pl
      .DataFrame({
        id: [1, null, 3],
      })
      .lazy()

    const tableSchema: TableSchema = {
      required: ["id"],
      properties: {
        id: { type: "number" },
      },
    }

    const errors = await inspectTable(table, { tableSchema })

    expect(errors).toEqual([{
      type: "cell/required",
      columnName: "id",
      rowNumber: 2,
      cell: "",
    }])
  })
})
