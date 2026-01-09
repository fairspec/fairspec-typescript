import type { Schema } from "@fairspec/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../table/index.ts"

describe("stringifyColumn", () => {
  describe("missing values", () => {
    it.each([
      // Schema-level - null values should be converted to first missing value
      [null, "", {}],
      [null, "", { schemaLevel: [] }], // defaults to ""
      [null, "-", { schemaLevel: ["-"] }],
      [null, "x", { schemaLevel: ["x"] }],

      // Regular values should remain unchanged
      ["hello", "hello", {}],
      ["world", "world", { schemaLevel: ["-"] }],

      // Column-level missing values take precedence
      [null, "", {}], // default column-level missing value
      [null, "-", { columnLevel: ["-"] }],
      [null, "n/a", { columnLevel: ["n/a"] }],

      // Regular values with column-level settings
      ["test", "test", { columnLevel: ["-"] }],
      ["value", "value", { columnLevel: ["n/a"] }],

      // Column-level overrides schema-level
      [null, "-", { schemaLevel: ["x"], columnLevel: ["-"] }],
      [null, "x", { schemaLevel: ["-"], columnLevel: ["x"] }],

      // Multiple missing values - should use first one
      [null, "-", { columnLevel: ["-", "n/a", "null"] }],
      [null, "n/a", { schemaLevel: ["n/a", "NULL", ""] }],

      // @ts-expect-error
    ])("%s -> %s %s", async (value, expected, { columnLevel, schemaLevel }) => {
      const table = pl.DataFrame({ name: [value] }).lazy()
      const schema: Schema = {
        missingValues: schemaLevel,
        columns: [{ name: "name", type: "string", missingValues: columnLevel }],
      }

      const result = await denormalizeTable(table, schema)
      const frame = await result.collect()

      expect(frame.toRecords()[0]?.name).toEqual(expected)
    })
  })
})
