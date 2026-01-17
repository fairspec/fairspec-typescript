import type { Resource } from "@fairspec/metadata"
import { describe, expect, it } from "vitest"
import type { FrictionlessResource } from "../../models/resource.ts"
import { convertResourceToFrictionless } from "./toFrictionless.ts"

describe("convertResourceToFrictionless", () => {
  it("should convert resource with path and basic metadata", () => {
    const resource: Resource = {
      data: "data.csv",
      name: "data",
      format: { name: "csv" },
      titles: [{ title: "Sample Data" }],
      descriptions: [
        {
          description: "A sample dataset",
          descriptionType: "Abstract",
        },
      ],
    }

    const frictionlessResource: FrictionlessResource = {
      name: "data",
      path: "data.csv",
      title: "Sample Data",
      description: "A sample dataset",
      format: "csv",
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should convert resource with inline data and licenses", () => {
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

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should convert resource with integrity and sizes", () => {
    const resource: Resource = {
      data: "file.json",
      name: "file",
      format: { name: "json" },
      integrity: {
        type: "md5",
        hash: "5d41402abc4b2a76b9719d911017c592",
      },
      sizes: ["1024 bytes"],
    }

    const frictionlessResource: FrictionlessResource = {
      name: "file",
      path: "file.json",
      format: "json",
      hash: "md5:5d41402abc4b2a76b9719d911017c592",
      bytes: 1024,
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should provide default name when missing", () => {
    const resource: Resource = {
      data: "data.csv",
    }

    const frictionlessResource: FrictionlessResource = {
      name: "resource",
      path: "data.csv",
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should convert resource with table schema", () => {
    const resource: Resource = {
      data: "users.csv",
      name: "users",
      tableSchema: {
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
        required: ["id"],
      },
    }

    const frictionlessResource: FrictionlessResource = {
      name: "users",
      path: "users.csv",
      schema: {
        fields: [
          {
            name: "id",
            type: "string",
            constraints: {
              required: true,
            },
          },
          {
            name: "name",
            type: "string",
          },
        ],
      },
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should convert resource with string schema reference", () => {
    const resource: Resource = {
      data: "data.csv",
      name: "data",
      tableSchema: "schema.json",
    }

    const frictionlessResource: FrictionlessResource = {
      name: "data",
      path: "data.csv",
      schema: "schema.json",
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })

  it("should parse sizes with various formats", () => {
    const resource: Resource = {
      data: "file.csv",
      name: "file",
      sizes: ["2048 bytes"],
    }

    const frictionlessResource: FrictionlessResource = {
      name: "file",
      path: "file.csv",
      bytes: 2048,
    }

    const result = convertResourceToFrictionless(resource)
    expect(result).toEqual(frictionlessResource)
  })
})
