import { describe, expect, expectTypeOf, it } from "vitest"
import type { Dataset } from "../../models/dataset.ts"
import { assertDataset } from "./assert.ts"

describe("assertDataset", () => {
  it("returns typed package when valid", async () => {
    const descriptor = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      language: "en",
      resources: [
        {
          name: "name",
          data: "table.csv",
        },
      ],
    }

    const dataset = await assertDataset(descriptor)

    expectTypeOf(dataset).toEqualTypeOf<Dataset>()
    expect(dataset).toEqual(descriptor)
  })

  it("throws Error when package is invalid", async () => {
    const descriptor = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      language: 123,
      resources: "not-an-array",
    }

    await expect(assertDataset(descriptor)).rejects.toThrow(Error)
  })
})
