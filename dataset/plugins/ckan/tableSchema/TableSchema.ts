import { z } from "zod"
import { CkanColumn } from "./Column.ts"

export const CkanTableSchema = z
  .object({
    fields: z.array(CkanColumn).describe("List of columns"),
  })
  .describe("CKAN Table Schema interface")

export type CkanTableSchema = z.infer<typeof CkanTableSchema>
