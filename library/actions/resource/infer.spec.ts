import { writeTempFile } from "@fairspec/dataset"
import type { Resource } from "@fairspec/metadata"
import { describe, expect, it } from "vitest"
import { inferResource } from "./infer.ts"

describe("inferResource", () => {
  it("should infer name from path", async () => {
    const path = await writeTempFile("id,name\n1,alice\n2,bob")
    const source: Resource = { data: path, format: { type: "csv" } }

    const target = await inferResource(source)

    expect(target.name).toBeDefined()
    expect(typeof target.name).toBe("string")
  })

  it("should infer format from file extension", async () => {
    const path = await writeTempFile("id,name\n1,alice\n2,bob", {
      format: "csv",
    })
    const source: Resource = { data: path }

    const target = await inferResource(source)

    expect(target.format?.type).toBe("csv")
  })

  it("should infer tableSchema for CSV data", async () => {
    const path = await writeTempFile("id,name\n1,alice\n2,bob")
    const source: Resource = { data: path, format: { type: "csv" } }

    const target = await inferResource(source)

    expect(target.tableSchema).toEqual({
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    })
  })

  it("should infer tableSchema from inline data", async () => {
    const source: Resource = {
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const target = await inferResource(source)

    expect(target.tableSchema).toEqual({
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
      },
    })
  })

  it("should preserve existing properties", async () => {
    const path = await writeTempFile("id,name\n1,alice\n2,bob")
    const source: Resource = {
      data: path,
      format: { type: "csv" },
      name: "custom-name",
    }

    const target = await inferResource(source)

    expect(target.name).toBe("custom-name")
  })

  it("should not override existing tableSchema", async () => {
    const path = await writeTempFile("id,name\n1,alice\n2,bob")
    const source: Resource = {
      data: path,
      format: { type: "csv" },
      tableSchema: {
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
    }

    const target = await inferResource(source)

    expect(target.tableSchema).toEqual({
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
    })
  })
})
