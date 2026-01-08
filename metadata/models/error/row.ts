import { z } from "zod"

export const RowUniqueError = z.object({
  type: z.literal("row/unique").describe("Error type identifier"),
  rowNumber: z.number().describe("The row number where the error occurred"),

  columnNames: z
    .array(z.string())
    .describe("Column names involved in the unique constraint violation"),
})

export const RowError = z.discriminatedUnion("type", [RowUniqueError])

export type RowUniqueError = z.infer<typeof RowUniqueError>
export type RowError = z.infer<typeof RowError>
