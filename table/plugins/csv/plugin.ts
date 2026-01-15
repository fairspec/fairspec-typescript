import type { CsvFormat, Resource, TsvFormat } from "@fairspec/metadata"
import { getFileExtension, getFirstDataPath } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { inferCsvFormat } from "./actions/format/infer.ts"
import { loadCsvTable } from "./actions/table/load.ts"
import { saveCsvTable } from "./actions/table/save.ts"

// TODO: splig csv/tsv and similar plugins?
// TODO: improve nameing loadCsvTable/saveCsvTable (tsv?)

export class CsvPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const format = getSupportedFormat(resource)
    if (!format) return undefined

    return await loadCsvTable({ ...resource, format }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path } = options

    const format = getSupportedFormat({ data: path, ...options })
    if (!format) return undefined

    return await saveCsvTable(table, { ...options, format })
  }

  async inferFormat(resource: Partial<Resource>) {
    const format = getSupportedFormat(resource)
    if (!format) return undefined

    return await inferCsvFormat(resource)
  }
}

function getSupportedFormat(resource: Partial<Resource>) {
  if (resource.format?.type === "csv" || resource.format?.type === "tsv") {
    return resource.format
  }

  const firstPath = getFirstDataPath(resource)
  if (!firstPath) return undefined

  const extension = getFileExtension(firstPath)
  const format: CsvFormat | TsvFormat | undefined =
    extension === "csv" || extension === "tsv" ? { type: extension } : undefined

  return format
}
