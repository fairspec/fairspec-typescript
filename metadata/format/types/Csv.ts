import { z } from "zod"
import {
  ColumnNames,
  CommentChar,
  CommentRows,
  Delimiter,
  Encoding,
  HeaderJoin,
  HeaderRows,
  LineTerminator,
  NullSequence,
  QuoteChar,
} from "../Common.ts"

export const CsvFormat = z.object({
  name: z.literal("csv"),
  encoding: Encoding.optional(),
  delimiter: Delimiter.optional(),
  lineTerminator: LineTerminator.optional(),
  quoteChar: QuoteChar.optional(),
  nullSequence: NullSequence.optional(),
  headerRows: HeaderRows.optional(),
  headerJoin: HeaderJoin.optional(),
  commentRows: CommentRows.optional(),
  commentChar: CommentChar.optional(),
  columnNames: ColumnNames.optional(),
})

export type CsvFormat = z.infer<typeof CsvFormat>
