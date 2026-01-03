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
      fields: [
        {
          name: "id",
          type: 123, // Should be a string
        },
      ],
    }

    const report = await validateTableSchema(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      // The error could be either type or enum depending on schema validation
      expect(error.pointer).toContain("/fields/0/type")
    }
  })
})
