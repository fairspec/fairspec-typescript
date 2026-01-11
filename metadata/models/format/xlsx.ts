import { z } from "zod"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  SheetName,
  SheetNumber,
} from "./common.ts"

export const XlsxFormat = z.object({
  type: z.literal("xlsx"),
  sheetName: SheetName.optional(),
  sheetNumber: SheetNumber.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type XlsxFormat = z.infer<typeof XlsxFormat>
