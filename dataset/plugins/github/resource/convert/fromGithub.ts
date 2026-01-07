import type { Resource } from "@fairspec/metadata"
import { getFileNameSlug } from "@fairspec/metadata"
import type { GithubResource } from "../Resource.ts"

export function convertResourceFromGithub(
  githubResource: GithubResource,
  options: {
    defaultBranch: string
  },
) {
  const path = convertPath({
    ...githubResource,
    ref: options.defaultBranch,
  })

  const resource: Resource = {
    data: path,
    name: getFileNameSlug(path) ?? githubResource.sha,
    integrity: {
      type: "sha1",
      hash: githubResource.sha,
    },
    unstable_customMetadata: {
      githubKey: githubResource.path,
      githubUrl: path,
    },
  }

  return resource
}

function convertPath(options: { url: string; ref: string; path: string }) {
  const url = new URL(options.url)
  const [owner, repo] = url.pathname.split("/").slice(2)
  return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${options.ref}/${options.path}`
}
