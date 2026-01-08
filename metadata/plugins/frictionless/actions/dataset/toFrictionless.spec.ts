import { describe, expect, it } from "vitest"
import type { Dataset } from "../../../../models/dataset.ts"
import type { FrictionlessPackage } from "../../models/package.ts"
import { convertDatasetToFrictionless } from "./toFrictionless.ts"

describe("convertDatasetToFrictionless", () => {
  it("should convert dataset with basic metadata", () => {
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

    const result = convertDatasetToFrictionless(dataset)
    expect(result).toEqual(frictionlessPackage)
  })

  it("should convert dataset with creators and contributors", () => {
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

    const result = convertDatasetToFrictionless(dataset)
    expect(result).toEqual(frictionlessPackage)
  })

  it("should convert dataset with dates and homepage", () => {
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

    const result = convertDatasetToFrictionless(dataset)
    expect(result).toEqual(frictionlessPackage)
  })

  it("should handle empty resources array", () => {
    const dataset: Dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      titles: [{ title: "Empty Dataset" }],
    }

    const frictionlessPackage: FrictionlessPackage = {
      resources: [],
      title: "Empty Dataset",
    }

    const result = convertDatasetToFrictionless(dataset)
    expect(result).toEqual(frictionlessPackage)
  })

  it("should convert all contributor types correctly", () => {
    const dataset: Dataset = {
      $schema: "https://fairspec.org/profiles/latest/dataset.json",
      resources: [],
      contributors: [
        { name: "Person 1", contributorType: "ContactPerson" },
        { name: "Person 2", contributorType: "DataCollector" },
        { name: "Person 3", contributorType: "ProjectLeader" },
        { name: "Person 4", contributorType: "Researcher" },
      ],
    }

    const frictionlessPackage: FrictionlessPackage = {
      resources: [],
      contributors: [
        { title: "Person 1", roles: ["contactperson"] },
        { title: "Person 2", roles: ["datacollector"] },
        { title: "Person 3", roles: ["projectleader"] },
        { title: "Person 4", roles: ["researcher"] },
      ],
    }

    const result = convertDatasetToFrictionless(dataset)
    expect(result).toEqual(frictionlessPackage)
  })
})
