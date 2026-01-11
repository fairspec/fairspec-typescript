import { z } from "zod"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  RowType,
} from "./common.ts"

export const JsonlFormat = z.object({
  type: z.literal("jsonl"),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonlFormat = z.infer<typeof JsonlFormat>
