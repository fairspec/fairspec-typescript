import { z } from "zod"
import { ZenodoResource } from "../resource/index.ts"
import { ZenodoCreator } from "./Creator.ts"

export const ZenodoDataset = z
  .object({
    id: z.number().describe("Deposit identifier"),
    links: z
      .object({
        self: z.string(),
        html: z.string(),
        files: z.string(),
        bucket: z.string(),
        publish: z.string().optional(),
        discard: z.string().optional(),
        edit: z.string().optional(),
      })
      .describe("Deposit URL"),
    metadata: z
      .object({
        title: z.string().describe("Title of the deposit"),
        description: z.string().describe("Description of the deposit"),
        upload_type: z.string().describe('Upload type, e.g., "dataset"'),
        publication_date: z
          .string()
          .optional()
          .describe("Publication date in ISO format (YYYY-MM-DD)"),
        creators: z.array(ZenodoCreator).describe("Creators of the deposit"),
        access_right: z
          .string()
          .optional()
          .describe('Access right, e.g., "open", "embargoed", "restricted", "closed"'),
        license: z.string().optional().describe("License identifier"),
        doi: z.string().optional().describe("DOI of the deposit"),
        keywords: z.array(z.string()).optional().describe("Keywords/tags"),
        related_identifiers: z
          .array(
            z.object({
              identifier: z.string(),
              relation: z.string(),
              scheme: z.string(),
            }),
          )
          .optional()
          .describe("Related identifiers (e.g., DOIs of related works)"),
        communities: z
          .array(
            z.object({
              identifier: z.string(),
            }),
          )
          .optional()
          .describe("Communities the deposit belongs to"),
        version: z.string().optional().describe("Version of the deposit"),
      })
      .describe("Deposit metadata"),
    files: z.array(ZenodoResource).describe("Files associated with the deposit"),
    state: z
      .enum(["unsubmitted", "inprogress", "done"])
      .describe("State of the deposit"),
    submitted: z.boolean().describe("Submitted flag"),
  })
  .describe("Zenodo Deposit interface")

export type ZenodoDataset = z.infer<typeof ZenodoDataset>
