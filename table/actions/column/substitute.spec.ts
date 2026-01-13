import type { TableSchema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../actions/table/normalize.ts"

describe("substituteColumn", () => {
  describe("missing values", () => {
    it.each([
      // Schema-level
      ["", null, {}],
      ["", "", { schemaLevel: [] }],
      ["-", null, { schemaLevel: ["-"] }],
      ["x", null, { schemaLevel: ["x"] }],

      // Column-level
      ["", null, {}],
      ["-", null, { columnLevel: ["-"] }],
      ["-", "-", { columnLevel: [""] }],
      ["n/a", null, { columnLevel: ["n/a"] }],

      // Schema-level and column-level
      ["-", null, { schemaLevel: ["x"], columnLevel: ["-"] }],
      ["-", null, { schemaLevel: ["-"], columnLevel: ["x"] }],
      // @ts-expect-error
    ])("$0 -> $1 $2", async (cell, expected, { columnLevel, schemaLevel }) => {
      const table = pl.DataFrame({ name: [cell] }).lazy()
      const tableSchema: TableSchema = {
        missingValues: schemaLevel,
        properties: {
          name: { type: "string", missingValues: columnLevel },
        },
      }

      const result = await normalizeTable(table, tableSchema)
      const frame = await result.collect()

      const actual = frame.getColumn("name").get(0)
      expect(actual).toEqual(expected)
    })
  })
})
