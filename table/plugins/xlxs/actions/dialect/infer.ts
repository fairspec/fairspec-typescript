import { loadFile } from "@fairspec/dataset"
import type { OdsDialect, Resource, XlsxDialect } from "@fairspec/metadata"
import { getDataFirstPath, getSupportedDialect } from "@fairspec/metadata"
import { read, utils } from "xlsx"
import { Sniffer } from "../../../../utils/sniffer/sniffer.ts"

export async function inferXlsxDialect(
  resource: Resource,
  options?: {
    sampleRows?: number
  },
): Promise<XlsxDialect | OdsDialect | undefined> {
  const { sampleRows = 100 } = options ?? {}

  const dataPath = getDataFirstPath(resource)
  if (!dataPath) {
    return undefined
  }

  const dialect = await getSupportedDialect(resource, ["xlsx", "ods"])
  if (!dialect) {
    return undefined
  }

  const buffer = await loadFile(dataPath)
  const book = read(buffer, { type: "buffer" })

  const sheetIndex = dialect?.sheetNumber ? dialect.sheetNumber - 1 : 0
  const sheetName = dialect?.sheetName ?? book.SheetNames[sheetIndex]

  if (!sheetName) {
    return { format: dialect.format }
  }

  const sheet = book.Sheets[sheetName]
  if (!sheet) {
    return { format: dialect.format }
  }

  const allRows = utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: null,
  }) as unknown[][]

  const rows = allRows.slice(0, sampleRows)

  if (rows.length === 0) {
    return { format: dialect.format }
  }

  const sniffer = new Sniffer()
  let detection: ReturnType<typeof sniffer.sniffRows>

  try {
    detection = sniffer.sniffRows(rows)
  } catch {
    return { format: dialect.format }
  }

  const result = { format: dialect.format } as XlsxDialect | OdsDialect

  if (detection.dialect.header.hasHeaderRow) {
    result.headerRows = [detection.dialect.header.numPreambleRows + 1]
  } else if (detection.numFields > 0) {
    result.headerRows = false
  }

  return result
}
