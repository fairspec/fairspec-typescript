import { describe, expect, it } from "vitest"
import { loadSqliteTable } from "./load.ts"

describe("loadSqliteTable", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      loadSqliteTable({
        format: { type: "sqlite", tableName: "fairspec" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })

  it("throws error when table name is not defined", async () => {
    await expect(
      loadSqliteTable({
        data: "path",
        format: { type: "sqlite" },
      }),
    ).rejects.toThrow("Table name is not defined")
  })
})
