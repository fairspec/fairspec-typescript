import { z } from "zod"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  SheetName,
  SheetNumber,
} from "./Common.ts"

export const OdsFormat = z.object({
  name: z.literal("ods"),
  sheetName: SheetName.optional(),
  sheetNumber: SheetNumber.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type OdsFormat = z.infer<typeof OdsFormat>
