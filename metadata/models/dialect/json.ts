import { z } from "zod"
import { BaseDialect } from "./base.ts"
import {
  ColumnNames,
  CommentPrefix,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  JsonPointer,
  RowType,
} from "./common.ts"

export const JsonDialect = BaseDialect.extend({
  format: z.literal("json"),
  jsonPointer: JsonPointer.optional(),
  rowType: RowType.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentPrefix: CommentPrefix.optional(),
  columnNames: ColumnNames.optional(),
})

export type JsonDialect = z.infer<typeof JsonDialect>
