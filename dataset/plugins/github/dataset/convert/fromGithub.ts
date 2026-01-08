import type { Dataset } from "@fairspec/metadata"
import { convertResourceFromGithub } from "../../resource/index.ts"
import type { GithubDataset } from "../Dataset.ts"

export function convertDatasetFromGithub(
  githubDataset: GithubDataset,
): Dataset {
  const dataset: Dataset = {
    $schema: "https://fairspec.org/schema/latest/dataset.json",
    resources: [],
  }

  if (githubDataset.full_name) {
    dataset.titles = [{ title: githubDataset.full_name }]
  }

  if (githubDataset.description) {
    dataset.descriptions = [
      {
        description: githubDataset.description,
        descriptionType: "Abstract",
      },
    ]
  }

  if (githubDataset.license) {
    dataset.rightsList = [
      {
        rights: githubDataset.license.name,
        rightsUri: githubDataset.license.url,
        rightsIdentifier:
          githubDataset.license.spdx_id || githubDataset.license.key,
        rightsIdentifierScheme: "SPDX",
      },
    ]
  }

  if (githubDataset.owner) {
    const contributor = {
      name: githubDataset.owner.login,
      nameType:
        githubDataset.owner.type === "Organization"
          ? "Organizational"
          : "Personal",
    } as const

    if (githubDataset.owner.type === "Organization") {
      dataset.contributors = [
        {
          ...contributor,
          contributorType: "HostingInstitution",
        },
      ]
    } else {
      dataset.creators = [contributor]
    }
  }

  if (githubDataset.resources && githubDataset.resources.length > 0) {
    dataset.resources = githubDataset.resources
      .filter(resource => !resource.path.startsWith("."))
      .filter(resource => resource.type === "blob")
      .map(resource =>
        convertResourceFromGithub(resource, {
          defaultBranch: githubDataset.default_branch,
        }),
      )
  }

  if (githubDataset.topics && githubDataset.topics.length > 0) {
    dataset.subjects = githubDataset.topics.map(topic => ({ subject: topic }))
  }

  if (githubDataset.created_at) {
    dataset.dates = [
      {
        date: githubDataset.created_at,
        dateType: "Created",
      },
    ]
  }

  return dataset
}
