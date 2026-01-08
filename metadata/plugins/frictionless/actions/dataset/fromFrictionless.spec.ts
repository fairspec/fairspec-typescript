import { describe, expect, it } from "vitest"
import type { Dataset } from "../../../../models/dataset.ts"
import type { FrictionlessPackage } from "../../models/package.ts"
import { convertDatasetFromFrictionless } from "./fromFrictionless.ts"

describe("convertDatasetFromFrictionless", () => {
  it("should convert package with basic metadata", () => {
    const frictionlessPackage: FrictionlessPackage = {
      resources: [
        {
          name: "data",
          path: "data.csv",
        },
      ],
      title: "My Dataset",
      description: "A sample dataset for testing",
      version: "1.0.0",
      keywords: ["test", "sample"],
    }

    const dataset: Dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      resources: [
        {
          data: "data.csv",
          name: "data",
        },
      ],
      titles: [{ title: "My Dataset" }],
      descriptions: [
        {
          description: "A sample dataset for testing",
          descriptionType: "Abstract",
        },
      ],
      version: "1.0.0",
      subjects: [{ subject: "test" }, { subject: "sample" }],
    }

    const result = convertDatasetFromFrictionless(frictionlessPackage)
    expect(result).toEqual(dataset)
  })

  it("should convert package with contributors and licenses", () => {
    const frictionlessPackage: FrictionlessPackage = {
      resources: [
        {
          name: "data",
          path: "data.csv",
        },
      ],
      contributors: [
        {
          title: "John Doe",
          givenName: "John",
          familyName: "Doe",
          roles: ["creator"],
          organization: "University",
        },
        {
          title: "Jane Smith",
          roles: ["datacurator"],
        },
      ],
      licenses: [
        {
          name: "MIT",
          path: "https://opensource.org/licenses/MIT",
        },
      ],
    }

    const dataset: Dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      resources: [
        {
          data: "data.csv",
          name: "data",
        },
      ],
      creators: [
        {
          name: "John Doe",
          givenName: "John",
          familyName: "Doe",
          affiliation: [{ name: "University" }],
        },
      ],
      contributors: [
        {
          name: "Jane Smith",
          contributorType: "DataCurator",
        },
      ],
      rightsList: [
        {
          rights: "MIT",
          rightsUri: "https://opensource.org/licenses/MIT",
        },
      ],
    }

    const result = convertDatasetFromFrictionless(frictionlessPackage)
    expect(result).toEqual(dataset)
  })

  it("should convert package with dates and homepage", () => {
    const frictionlessPackage: FrictionlessPackage = {
      resources: [
        {
          name: "data",
          path: "data.csv",
        },
      ],
      created: "2024-01-01T00:00:00Z",
      homepage: "https://example.com/dataset",
    }

    const dataset: Dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      resources: [
        {
          data: "data.csv",
          name: "data",
        },
      ],
      dates: [
        {
          date: "2024-01-01T00:00:00Z",
          dateType: "Created",
        },
      ],
      relatedIdentifiers: [
        {
          relatedIdentifier: "https://example.com/dataset",
          relationType: "IsDescribedBy",
          relatedIdentifierType: "URL",
        },
      ],
    }

    const result = convertDatasetFromFrictionless(frictionlessPackage)
    expect(result).toEqual(dataset)
  })
})
