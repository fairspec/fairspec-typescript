import { z } from "zod"

export const FrictionlessContributor = z.object({
  title: z
    .string()
    .optional()
    .describe("A string containing a name of the contributor"),
  givenName: z
    .string()
    .optional()
    .describe(
      "A string containing the name a person has been given, if the contributor is a person",
    ),
  familyName: z
    .string()
    .optional()
    .describe(
      "A string containing the familial name that a person inherits, if the contributor is a person",
    ),
  path: z
    .string()
    .optional()
    .describe(
      "A fully qualified URL pointing to a relevant location online for the contributor",
    ),
  email: z.string().optional().describe("A string containing an email address"),
  roles: z
    .array(z.string())
    .optional()
    .describe(
      "An array of strings describing the roles of the contributor. A role is recommended to follow an established vocabulary, such as DataCite Metadata Schema's contributorRole or CRediT. Useful roles to indicate are: creator, contact, rightsHolder, and dataCurator",
    ),
  organization: z
    .string()
    .optional()
    .describe(
      "A string describing the organization this contributor is affiliated to",
    ),
})

export type FrictionlessContributor = z.infer<typeof FrictionlessContributor>
