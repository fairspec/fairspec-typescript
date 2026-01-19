import { z } from "zod"
import { BaseFormat } from "./base.ts"
import {
  ColumnNames,
  CommentPrefix,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  JsonPointer,
  RowType,
} from "./common.ts"

export const JsonFormat = BaseFormat.extend({
  name: z.literal("json"),
  jsonPointer: JsonPointer.optional(),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentPrefix: CommentPrefix.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonFormat = z.infer<typeof JsonFormat>
