import type { Resource } from "@fairspec/metadata"
import { getDataPaths, getFileExtension } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadOdsTable } from "./actions/table/load.ts"
import { saveOdsTable } from "./actions/table/save.ts"

export class OdsPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isOds = getIsOds(resource)
    if (!isOds) return undefined

    return await loadOdsTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const formatObject = format ? { type: format } : undefined
    const isOds = getIsOds({ data: path, format: formatObject })
    if (!isOds) return undefined

    return await saveOdsTable(table, options)
  }
}

function getIsOds(resource: Partial<Resource>) {
  if (resource.format?.type === "ods") return true

  const paths = getDataPaths(resource)
  const firstPath = paths[0]
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "ods"
}
