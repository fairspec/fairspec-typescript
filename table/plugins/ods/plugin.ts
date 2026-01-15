import type { Resource } from "@fairspec/metadata"
import { getDataFirstPath, getFileExtension } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadOdsTable } from "./actions/table/load.ts"
import { saveOdsTable } from "./actions/table/save.ts"

// TODO: merge into xlxs plugin as it is very similar?

export class OdsPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isOds = getIsOds(resource)
    if (!isOds) return undefined

    return await loadOdsTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isOds = getIsOds({ data: path, format })
    if (!isOds) return undefined

    return await saveOdsTable(table, options)
  }
}

function getIsOds(resource: Partial<Resource>) {
  if (resource.format?.type === "ods") return true

  const firstPath = getDataFirstPath(resource)
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "ods"
}
