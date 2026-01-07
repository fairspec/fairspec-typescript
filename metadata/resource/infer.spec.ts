import { describe, expect, it } from "vitest"
import { inferFormatName, inferResourceName } from "./infer.ts"

describe("inferResourceName", () => {
  it("dont returns existing name when provided", () => {
    const resource = { name: "existing-name", data: "/data/users.csv" }
    expect(inferResourceName(resource)).toBe("users")
  })

  it("infers name from single string path", () => {
    const resource = { data: "/data/users.csv" }
    expect(inferResourceName(resource)).toBe("users")
  })

  it("infers name from first path in array", () => {
    const resource = { data: ["/data/users.csv", "/data/backup.csv"] }
    expect(inferResourceName(resource)).toBe("users")
  })

  it("infers name from URL path", () => {
    const resource = { data: "https://example.com/data/products.json" }
    expect(inferResourceName(resource)).toBe("products")
  })

  it("returns default name when no path or name", () => {
    const resource = {}
    expect(inferResourceName(resource)).toBe("resource")
  })

  it("returns default name when path has no filename", () => {
    const resource = { data: "/data/folder/" }
    expect(inferResourceName(resource)).toBe("resource")
  })

  it("handles complex filename with multiple dots", () => {
    const resource = { data: "/data/file.backup.csv" }
    expect(inferResourceName(resource)).toBe("file")
  })

  it("slugifies filename with spaces and special characters", () => {
    const resource = { data: "/data/My Data File!.csv" }
    expect(inferResourceName(resource)).toBe("my_data_file")
  })
})

describe("inferFormatName", () => {
  it("dont returns existing format name when provided", () => {
    const resource = {
      data: "/data/users.csv",
      format: { name: "json" as const },
    }
    expect(inferFormatName(resource)).toBe("csv")
  })

  it("infers format from single string path", () => {
    const resource = { data: "/data/users.csv" }
    expect(inferFormatName(resource)).toBe("csv")
  })

  it("infers format from first path in array", () => {
    const resource = { data: ["/data/users.xlsx", "/data/backup.csv"] }
    expect(inferFormatName(resource)).toBe("xlsx")
  })

  it("infers format from URL path", () => {
    const resource = { data: "https://example.com/data/products.json" }
    expect(inferFormatName(resource)).toBe("json")
  })

  it("returns lowercase format", () => {
    const resource = { data: "/data/file.CSV" }
    expect(inferFormatName(resource)).toBe("csv")
  })

  it("returns format name even for unsupported extensions", () => {
    const resource = { data: "/data/file.tar.gz" }
    expect(inferFormatName(resource)).toBe("gz")
  })

  it("returns undefined when no path", () => {
    const resource = {}
    expect(inferFormatName(resource)).toBeUndefined()
  })

  it("returns undefined when path has no extension", () => {
    const resource = { data: "/data/file" }
    expect(inferFormatName(resource)).toBeUndefined()
  })

  it("returns undefined when filename cannot be determined", () => {
    const resource = { data: "/data/folder/" }
    expect(inferFormatName(resource)).toBeUndefined()
  })

  it("infers postgresql protocol from connection string", () => {
    const resource = {
      data: "postgresql://user:password@localhost:5432/database",
    }
    expect(inferFormatName(resource)).toBe("postgresql")
  })

  it("infers mysql protocol from connection string", () => {
    const resource = { data: "mysql://user:password@localhost:3306/database" }
    expect(inferFormatName(resource)).toBe("mysql")
  })

  it("infers sqlite protocol from file path", () => {
    const resource = { data: "sqlite:///path/to/database.db" }
    expect(inferFormatName(resource)).toBe("sqlite")
  })

  it("infers sqlite protocol with file scheme", () => {
    const resource = { data: "sqlite://localhost/path/to/database.db" }
    expect(inferFormatName(resource)).toBe("sqlite")
  })

  it("handles postgres protocol with ssl parameters", () => {
    const resource = {
      data: "postgresql://user:pass@host:5432/db?sslmode=require",
    }
    expect(inferFormatName(resource)).toBe("postgresql")
  })

  it("handles mysql protocol with options", () => {
    const resource = { data: "mysql://user:pass@host:3306/db?charset=utf8" }
    expect(inferFormatName(resource)).toBe("mysql")
  })
})
