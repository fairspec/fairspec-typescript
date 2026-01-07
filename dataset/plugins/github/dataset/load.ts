import { mergeDatasets } from "../../../dataset/index.ts"
import { makeGithubApiRequest } from "../platform/index.ts"
import type { GithubResource } from "../resource/index.ts"
import type { GithubDataset } from "./Dataset.ts"
import { convertDatasetFromGithub } from "./convert/fromGithub.ts"

/**
 * Load a package from a Github repository
 * @param props Object containing the URL to the Github repository
 * @returns Dataset object
 */
export async function loadDatasetFromGithub(
  repoUrl: string,
  options?: {
    apiKey?: string
  },
) {
  const { apiKey } = options ?? {}

  // Extract owner and repo from URL
  const { owner, repo } = extractRepositoryInfo(repoUrl)
  if (!owner || !repo) {
    throw new Error(`Failed to extract repository info from URL: ${repoUrl}`)
  }

  const githubDataset = await makeGithubApiRequest<GithubDataset>({
    endpoint: `/repos/${owner}/${repo}`,
    apiKey,
  })

  const ref = githubDataset.default_branch
  githubDataset.resources = (
    await makeGithubApiRequest<{ tree: GithubResource[] }>({
      endpoint: `/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
      apiKey,
    })
  ).tree

  const systemDataset = convertDatasetFromGithub(githubDataset)
  const userDatasetPath = (systemDataset.resources ?? [])
    .filter(resource => resource.unstable_customMetadata?.githubKey === "fairspec.json")
    .map(resource => resource.unstable_customMetadata?.githubUrl)
    .at(0) as string | undefined

  const dataset = await mergeDatasets({ systemDataset, userDatasetPath })
  dataset.resources?.forEach(resource => {
    delete resource.unstable_customMetadata
  })

  return dataset
}

/**
 * Extract repository owner and name from URL
 *
 * Examples:
 * - https://github.com/owner/repo
 */
function extractRepositoryInfo(repoUrl: string) {
  const url = new URL(repoUrl)
  const [owner, repo] = url.pathname.split("/").filter(Boolean)
  return { owner, repo }
}
