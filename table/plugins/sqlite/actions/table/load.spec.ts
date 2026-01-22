import { describe, expect, it } from "vitest"
import { loadSqliteTable } from "./load.ts"

describe("loadSqliteTable", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      loadSqliteTable({
        dialect: { format: "sqlite", tableName: "fairspec" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })
})
