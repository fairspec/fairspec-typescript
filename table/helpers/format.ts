import type { FormatWithHeaderRows } from "../models/format.ts"

export function getHeaderRows(format: FormatWithHeaderRows) {
  return format.headerRows !== false ? (format.headerRows ?? [1]) : []
}
