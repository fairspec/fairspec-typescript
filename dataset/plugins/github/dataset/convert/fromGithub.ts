import type { Contributor, License, Package } from "@fairspec/metadata"
import { convertResourceFromGithub } from "../../resource/index.ts"
import type { GithubPackage } from "../Package.ts"

export function convertDatasetFromGithub(
  githubDataset: GithubPackage,
): Package {
  const dataset: Package = {
    name: githubDataset.name,
    resources: [],
  }

  if (githubDataset.description) {
    dataset.description = githubDataset.description
  }

  dataset.title = githubDataset.full_name

  if (githubDataset.homepage) {
    dataset.homepage = githubDataset.homepage
  }

  if (githubDataset.license) {
    const license: License = {
      name: githubDataset.license.spdx_id || githubDataset.license.key,
    }

    if (githubDataset.license.name) {
      license.title = githubDataset.license.name
    }

    if (githubDataset.license.url) {
      license.path = githubDataset.license.url
    }

    dataset.licenses = [license]
  }

  if (githubDataset.owner) {
    const contributor: Contributor = {
      title: githubDataset.owner.login,
      role:
        githubDataset.owner.type === "Organization" ? "publisher" : "author",
      path: githubDataset.owner.html_url,
    }

    dataset.contributors = [contributor]
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
    dataset.keywords = githubDataset.topics
  }

  if (githubDataset.created_at) {
    dataset.created = githubDataset.created_at
  }

  return dataset
}
