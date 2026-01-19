import { z } from "zod"
import { BaseFormat } from "./base.ts"
import {
  ColumnNames,
  CommentPrefix,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  RowType,
} from "./common.ts"

export const JsonlFormat = BaseFormat.extend({
  name: z.literal("jsonl"),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentPrefix: CommentPrefix.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonlFormat = z.infer<typeof JsonlFormat>
