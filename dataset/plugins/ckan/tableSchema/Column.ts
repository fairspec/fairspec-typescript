import { z } from "zod"

export const CkanColumnInfo = z
  .object({
    label: z.string().describe("Human-readable field label"),
    notes: z.string().describe("Additional notes about the field"),
    type_override: z.string().describe("Column type override"),
  })
  .describe("CKAN Column Info interface")

export const CkanColumn = z
  .object({
    id: z.string().describe("Column identifier"),
    type: z.string().describe("Column data type"),
    info: CkanColumnInfo.optional().describe("Additional field information"),
  })
  .describe("CKAN Column interface")

export type CkanColumnInfo = z.infer<typeof CkanColumnInfo>
export type CkanColumn = z.infer<typeof CkanColumn>
