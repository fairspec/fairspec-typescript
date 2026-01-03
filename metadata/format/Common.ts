import { z } from "zod"

export const Encoding = z.enum(["utf-8", "ascii"])

export const Delimiter = z.string().max(1)

export const LineTerminator = z.string()

export const QuoteChar = z.string()

export const NullSequence = z.string()

export const HeaderRows = z.union([
  z.literal(false),
  z.array(z.number().int().min(1)),
])

export const HeaderJoin = z.string()

export const CommentRows = z.array(z.number().int().min(1))

export const CommentChar = z.string()

export const ColumnNames = z.array(z.string())

export const JsonPointer = z.string()

export const RowType = z.enum(["array", "object"])

export const SheetNumber = z.number().int()

export const SheetName = z.string()

export const TableName = z.string()

export type Encoding = z.infer<typeof Encoding>
export type Delimiter = z.infer<typeof Delimiter>
export type LineTerminator = z.infer<typeof LineTerminator>
export type QuoteChar = z.infer<typeof QuoteChar>
export type NullSequence = z.infer<typeof NullSequence>
export type HeaderRows = z.infer<typeof HeaderRows>
export type HeaderJoin = z.infer<typeof HeaderJoin>
export type CommentRows = z.infer<typeof CommentRows>
export type CommentChar = z.infer<typeof CommentChar>
export type ColumnNames = z.infer<typeof ColumnNames>
export type JsonPointer = z.infer<typeof JsonPointer>
export type RowType = z.infer<typeof RowType>
export type SheetNumber = z.infer<typeof SheetNumber>
export type SheetName = z.infer<typeof SheetName>
export type TableName = z.infer<typeof TableName>
