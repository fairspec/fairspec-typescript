import { z } from "zod"
import { FrictionlessContributor } from "./contributor.ts"
import { FrictionlessLicense } from "./license.ts"
import { FrictionlessResource } from "./resource.ts"
import { FrictionlessSource } from "./source.ts"

export const FrictionlessPackage = z.object({
  $schema: z.string().optional().describe("URL of profile (optional)"),
  resources: z.array(FrictionlessResource).describe("Data resources in this package (required)"),
  name: z.string().optional().describe("Unique package identifier. Should use lowercase alphanumeric characters, periods, hyphens, and underscores"),
  title: z.string().optional().describe("Human-readable title"),
  description: z.string().optional().describe("A description of the package"),
  homepage: z.string().optional().describe("A URL for the home page of the package"),
  version: z.string().optional().describe("Version of the package using SemVer (e.g., \"1.0.0\")"),
  licenses: z.array(FrictionlessLicense).optional().describe("License information"),
  contributors: z.array(FrictionlessContributor).optional().describe("List of contributors"),
  sources: z.array(FrictionlessSource).optional().describe("Data sources for this package"),
  keywords: z.array(z.string()).optional().describe("Keywords for the package"),
  created: z.string().optional().describe("Create time of the package in ISO 8601 format"),
  image: z.string().optional().describe("Package image"),
})

export type FrictionlessPackage = z.infer<typeof FrictionlessPackage>
