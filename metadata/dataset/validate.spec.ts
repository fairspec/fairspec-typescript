import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
import { validateDatasetMetadata } from "./validate.ts"

useRecording()

describe("validateDatasetMetadata", () => {
  it("returns valid result for valid dataset", async () => {
    const dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      resources: [
        {
          data: "data.csv",
        },
      ],
    }

    const report = await validateDatasetMetadata(dataset)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid dataset", async () => {
    const dataset = {
      $schema: "invalid-schema",
      resources: "not-an-array",
    }

    const report = await validateDatasetMetadata(dataset)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
  })

  it("returns validation error for missing schema", async () => {
    const dataset = {
      resources: [
        {
          data: "data.csv",
        },
      ],
    }

    const report = await validateDatasetMetadata(dataset)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
  })

  it("validates dataset with datacite metadata", async () => {
    const dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      creators: [
        {
          name: "John Doe",
        },
      ],
      titles: [
        {
          title: "Example Dataset",
        },
      ],
      resources: [
        {
          data: "data.csv",
        },
      ],
    }

    const report = await validateDatasetMetadata(dataset)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })
})
