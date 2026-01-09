import type { Schema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../table/index.ts"

describe("parseColumn", () => {
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
      ["-", "-", { schemaLevel: ["-"], columnLevel: ["x"] }],
      // @ts-expect-error
    ])("$0 -> $1 $2", async (cell, value, { columnLevel, schemaLevel }) => {
      const table = pl.DataFrame({ name: [cell] }).lazy()
      const schema: Schema = {
        missingValues: schemaLevel,
        columns: [{ name: "name", type: "string", missingValues: columnLevel }],
      }

      const result = await normalizeTable(table, schema)
      const frame = await result.collect()

      expect(frame.getColumn("name").get(0)).toEqual(value)
    })
  })
})
