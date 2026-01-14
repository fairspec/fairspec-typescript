import type { Resource } from "@fairspec/metadata"
import { getDataPaths, getFileExtension } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadArrowTable } from "./actions/table/load.ts"
import { saveArrowTable } from "./actions/table/save.ts"

export class ArrowPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isArrow = getIsArrow(resource)
    if (!isArrow) return undefined

    return await loadArrowTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isArrow = getIsArrow({ data: path, format })
    if (!isArrow) return undefined

    return await saveArrowTable(table, options)
  }
}

function getIsArrow(resource: Partial<Resource>) {
  if (resource.format?.type === "arrow") return true

  const paths = getDataPaths(resource)
  const firstPath = paths[0]
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "arrow" || extension === "feather"
}
