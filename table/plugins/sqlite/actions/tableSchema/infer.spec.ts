import { describe, expect, it } from "vitest"
import { inferDatabaseSchema } from "./infer.ts"

describe("inferDatabaseSchema", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      inferDatabaseSchema({
        format: { type: "sqlite", tableName: "fairspec" },
      }),
    ).rejects.toThrow("Database is not defined")
  })

  it("throws error when table name is not defined", async () => {
    await expect(
      inferDatabaseSchema({
        data: "path",
        format: { type: "sqlite" },
      }),
    ).rejects.toThrow("Table name is not defined")
  })

  it("throws error when format is not supported", async () => {
    await expect(
      inferDatabaseSchema({
        data: "path",
        format: { type: "unsupported" as any, tableName: "fairspec" },
      }),
    ).rejects.toThrow('Unsupported database: "unsupported"')
  })
})
