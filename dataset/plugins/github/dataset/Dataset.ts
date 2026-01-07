import { z } from "zod"
import { GithubResource } from "../resource/index.ts"
import { GithubLicense } from "./License.ts"
import { GithubOwner } from "./Owner.ts"

export const GithubDataset = z
  .object({
    id: z.number().describe("Repository identifier"),
    name: z.string().describe("Repository name"),
    full_name: z.string().describe("Repository full name (owner/name)"),
    owner: GithubOwner.describe("Repository owner"),
    description: z.string().nullable().describe("Repository description"),
    created_at: z.string().describe("Repository creation date"),
    updated_at: z.string().describe("Repository update date"),
    homepage: z.string().nullable().describe("Repository homepage URL"),
    size: z.number().describe("Repository size in KB"),
    stargazers_count: z.number().describe("Repository stars count"),
    watchers_count: z.number().describe("Repository watchers count"),
    language: z.string().nullable().describe("Repository language"),
    license: GithubLicense.nullable().describe("Repository license"),
    default_branch: z.string().describe("Repository default branch"),
    topics: z.array(z.string()).describe("Repository topics"),
    private: z.boolean().describe("Repository is private"),
    archived: z.boolean().describe("Repository is archived"),
    html_url: z.string().describe("Repository URLs"),
    git_url: z.string(),
    ssh_url: z.string(),
    clone_url: z.string(),
    resources: z
      .array(GithubResource)
      .optional()
      .describe("Repository resources"),
  })
  .describe("Github repository as a package")

export type GithubDataset = z.infer<typeof GithubDataset>
