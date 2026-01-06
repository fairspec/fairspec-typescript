import { z } from "zod"
import { ColumnType } from "../../column/index.ts"

export const ColumnMissingError = z.object({
  type: z.literal("column/missing").describe("Error type identifier"),
  columnNames: z.array(z.string()).describe("Names of missing columns"),
})

export const ColumnTypeError = z.object({
  type: z.literal("column/type").describe("Error type identifier"),
  expectedColumnType: ColumnType.describe("The column type that was expected"),
  actualColumnType: ColumnType.describe("The actual column type found"),
})

export const ColumnError = z.discriminatedUnion("type", [
  ColumnMissingError,
  ColumnTypeError,
])

export type ColumnMissingError = z.infer<typeof ColumnMissingError>
export type ColumnTypeError = z.infer<typeof ColumnTypeError>
export type ColumnError = z.infer<typeof ColumnError>
