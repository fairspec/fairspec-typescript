import { z } from "zod"
import { BaseFormat } from "./base.ts"
import {
  ColumnNames,
  CommentPrefix,
  CommentRows,
  HeaderJoin,
  HeaderRows,
  LineTerminator,
  NullSequence,
} from "./common.ts"

export const TsvFormat = BaseFormat.extend({
  name: z.literal("tsv"),
  lineTerminator: LineTerminator.optional(),
  nullSequence: NullSequence.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentPrefix: CommentPrefix.optional(),
  columnNames: ColumnNames.optional(),
})

export type TsvFormat = z.infer<typeof TsvFormat>
