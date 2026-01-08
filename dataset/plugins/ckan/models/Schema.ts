import { z } from "zod"
import { CkanField } from "./Field.ts"

export const CkanSchema = z
  .object({
    fields: z.array(CkanField).describe("List of columns"),
  })
  .describe("CKAN  Schema interface")

export type CkanSchema = z.infer<typeof CkanSchema>
