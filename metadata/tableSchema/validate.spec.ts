import { describe, expect, it } from "vitest"
import { validateTableSchema } from "./validate.ts"

describe("validateTableSchema", () => {
  it("returns no errors for valid schema", async () => {
    const descriptor = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        id: {
          type: "integer",
        },
        name: {
          type: "string",
        },
      },
    }

    const report = await validateTableSchema(descriptor)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid schema", async () => {
    const descriptor = {
      $schema: "https://fairspec.org/profiles/latest/table.json",
      properties: {
        id: {
          type: 123,
        },
      },
    }

    const report = await validateTableSchema(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
  })

  it("returns error for missing $schema", async () => {
    const descriptor = {
      properties: {
        id: {
          type: "integer",
        },
      },
    }

    const report = await validateTableSchema(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
  })

  it("returns error for invalid $schema URL", async () => {
    const descriptor = {
      $schema: "https://fairspec.org/profiles/latest/dataste.json",
      properties: {
        id: {
          type: "integer",
        },
      },
    }

    const report = await validateTableSchema(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
  })
})
