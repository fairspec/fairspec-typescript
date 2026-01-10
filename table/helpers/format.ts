import type { FormatWithHeaderAndCommentRows } from "../models/format.ts"

export function getHeaderRows(format: FormatWithHeaderAndCommentRows) {
  return format.headerRows !== false ? (format.headerRows ?? [1]) : []
}
