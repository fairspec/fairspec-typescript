import { z } from "zod"
import { ContributorType, CreatorNameType } from "./Common.ts"
import { CreatorAffiliations, CreatorNameIdentifiers } from "./Creator.ts"

const Person = z.object({
  name: z.string().describe("The name of the contributor"),
  nameType: CreatorNameType.optional().describe(
    "The type of name (Organizational or Personal)",
  ),
  givenName: z.string().optional().describe("The personal or first name of the contributor"),
  familyName: z.string().optional().describe("The surname or last name of the contributor"),
  nameIdentifiers: CreatorNameIdentifiers.optional(),
  affiliation: CreatorAffiliations.optional(),
  lang: z
    .string()
    .optional()
    .describe("Language of the name, specified using ISO 639-1 or ISO 639-3 codes"),
})

export const Contributor = Person.extend({
  contributorType: ContributorType.describe(
    "The type of contributor (e.g., ContactPerson, DataCollector, Editor, etc.)",
  ),
})

export const Contributors = z
  .array(Contributor)
  .describe(
    "The institution or person responsible for collecting, managing, distributing, or otherwise contributing to the development of the resource",
  )

export type Contributor = z.infer<typeof Contributor>
export type Contributors = z.infer<typeof Contributors>
