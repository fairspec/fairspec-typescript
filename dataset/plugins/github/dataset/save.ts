import { Buffer } from "node:buffer"
import { buffer } from "node:stream/consumers"
import type { Dataset, Descriptor } from "@fairspec/metadata"
import { denormalizeDataset, stringifyDescriptor } from "@fairspec/metadata"
import { getDatasetBasepath } from "../../../dataset/index.ts"
import { saveResourceFiles } from "../../../resource/index.ts"
import { loadFileStream } from "../../../stream/index.ts"
import { makeGithubApiRequest } from "../platform/index.ts"
import type { GithubDataset } from "./Dataset.ts"

/**
 * Save a dataset to a Github repository
 * @param options Object containing the package to save and Github details
 * @returns Object with the repository URL
 */
export async function saveDatasetToGithub(
  dataset: Dataset,
  options: {
    apiKey: string
    repo: string
    org?: string
  },
) {
  const { apiKey, org, repo } = options
  const basepath = getDatasetBasepath(dataset)

  const githubDataset = await makeGithubApiRequest<GithubDataset>({
    endpoint: org ? `/orgs/${org}/repos` : "/user/repos",
    payload: { name: repo, auto_init: true },
    method: "POST",
    apiKey,
  })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataset.resources ?? []) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote: false,
        saveFile: async options => {
          const stream = await loadFileStream(options.normalizedPath)

          const payload = {
            path: options.denormalizedPath,
            content: Buffer.from(await buffer(stream)).toString("base64"),
            message: `Added file "${options.denormalizedPath}"`,
          }

          await makeGithubApiRequest({
            endpoint: `/repos/${githubDataset.owner.login}/${repo}/contents/${options.denormalizedPath}`,
            method: "PUT",
            payload,
            apiKey,
          })

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizeDataset(dataset, { basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["dataset.json"]) {
    const payload = {
      path: denormalizedPath,
      message: `Added file "${denormalizedPath}"`,
      content: Buffer.from(stringifyDescriptor(descriptor)).toString("base64"),
    }

    await makeGithubApiRequest({
      endpoint: `/repos/${githubDataset.owner.login}/${repo}/contents/${denormalizedPath}`,
      method: "PUT",
      payload,
      apiKey,
    })
  }

  return {
    path: `https://raw.githubusercontent.com/${githubDataset.owner.login}/${repo}/refs/heads/main/dataset.json`,
    repoUrl: githubDataset.html_url,
  }
}
