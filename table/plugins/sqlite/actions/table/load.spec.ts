import { describe, expect, it } from "vitest"
import { loadSqliteTable } from "./load.ts"

describe("loadSqliteTable", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      loadSqliteTable({
        format: { name: "sqlite", tableName: "fairspec" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })

  it("throws error when table name is not defined", async () => {
    await expect(
      loadSqliteTable({
        data: "path",
        format: { name: "sqlite" },
      }),
    ).rejects.toThrow("Table name is not defined")
  })
})
