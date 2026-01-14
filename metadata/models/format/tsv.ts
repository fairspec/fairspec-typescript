import { z } from "zod"
import { BaseFormat } from "./base.ts"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  LineTerminator,
  NullSequence,
} from "./common.ts"

export const TsvFormat = BaseFormat.extend({
  type: z.literal("tsv"),
  lineTerminator: LineTerminator.optional(),
  nullSequence: NullSequence.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type TsvFormat = z.infer<typeof TsvFormat>
