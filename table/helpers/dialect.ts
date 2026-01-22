import type { DialectWithHeaderAndCommentRows } from "../models/dialect.ts"

export function getHeaderRows(dialect?: DialectWithHeaderAndCommentRows) {
  return dialect?.headerRows !== false ? (dialect?.headerRows ?? [1]) : []
}
