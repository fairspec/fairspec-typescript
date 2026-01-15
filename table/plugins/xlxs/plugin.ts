import type { Resource } from "@fairspec/metadata"
import { getDataFirstPath, getFileExtension } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadXlsxTable } from "./actions/table/load.ts"
import { saveXlsxTable } from "./actions/table/save.ts"

export class XlsxPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isXlsx = getIsXlsx(resource)
    if (!isXlsx) return undefined

    return await loadXlsxTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isXlsx = getIsXlsx({ data: path, format })
    if (!isXlsx) return undefined

    return await saveXlsxTable(table, options)
  }
}

function getIsXlsx(resource: Partial<Resource>) {
  if (resource.format?.type === "xlsx") return true

  const firstPath = getDataFirstPath(resource)
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "xlsx"
}
