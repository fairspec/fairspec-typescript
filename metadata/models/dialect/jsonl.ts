import { z } from "zod"
import { BaseDialect } from "./base.ts"
import {
  ColumnNames,
  CommentPrefix,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  RowType,
} from "./common.ts"

export const JsonlDialect = BaseDialect.extend({
  format: z.literal("jsonl"),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentPrefix: CommentPrefix.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonlDialect = z.infer<typeof JsonlDialect>
