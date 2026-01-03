import { z } from "zod"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  Encoding,
  HeaderJoin,
  HeaderRows,
  LineTerminator,
  NullSequence,
} from "../Common.ts"

export const TsvFormat = z.object({
  name: z.literal("tsv"),
  encoding: Encoding.optional(),
  lineTerminator: LineTerminator.optional(),
  nullSequence: NullSequence.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type TsvFormat = z.infer<typeof TsvFormat>
