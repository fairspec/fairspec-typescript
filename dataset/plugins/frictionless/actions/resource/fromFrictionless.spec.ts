import { describe, expect, it } from "vitest"
import type { Resource } from "../../../../models/resource.ts"
import type { FrictionlessResource } from "../../models/resource.ts"
import { convertResourceFromFrictionless } from "./fromFrictionless.ts"

describe("convertResourceFromFrictionless", () => {
  it("should convert resource with path and basic metadata", () => {
    const frictionlessResource: FrictionlessResource = {
      name: "data",
      path: "data.csv",
      title: "Sample Data",
      description: "A sample dataset",
      format: "csv",
    }

    const resource: Resource = {
      data: "data.csv",
      name: "data",
      format: { type: "csv" },
      titles: [{ title: "Sample Data" }],
      descriptions: [
        {
          description: "A sample dataset",
          descriptionType: "Abstract",
        },
      ],
    }

    const result = convertResourceFromFrictionless(frictionlessResource)
    expect(result).toEqual(resource)
  })

  it("should convert resource with inline data and licenses", () => {
    const frictionlessResource: FrictionlessResource = {
      name: "inline-data",
      data: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      licenses: [
        {
          name: "CC-BY-4.0",
          path: "https://creativecommons.org/licenses/by/4.0/",
        },
      ],
    }

    const resource: Resource = {
      data: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      name: "inline-data",
      rightsList: [
        {
          rights: "CC-BY-4.0",
          rightsUri: "https://creativecommons.org/licenses/by/4.0/",
        },
      ],
    }

    const result = convertResourceFromFrictionless(frictionlessResource)
    expect(result).toEqual(resource)
  })

  it("should convert resource with hash and bytes", () => {
    const frictionlessResource: FrictionlessResource = {
      name: "file",
      path: "file.json",
      format: "json",
      hash: "md5:5d41402abc4b2a76b9719d911017c592",
      bytes: 1024,
    }

    const resource: Resource = {
      data: "file.json",
      name: "file",
      format: { type: "json" },
      integrity: {
        type: "md5",
        hash: "5d41402abc4b2a76b9719d911017c592",
      },
      sizes: ["1024 bytes"],
    }

    const result = convertResourceFromFrictionless(frictionlessResource)
    expect(result).toEqual(resource)
  })
})
