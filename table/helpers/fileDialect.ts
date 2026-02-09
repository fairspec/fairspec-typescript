import type { FileDialectWithHeaderAndCommentRows } from "../models/fileDialect.ts"

export function getHeaderRows(dialect?: FileDialectWithHeaderAndCommentRows) {
  return dialect?.headerRows !== false ? (dialect?.headerRows ?? [1]) : []
}
