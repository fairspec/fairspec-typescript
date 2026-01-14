import type { Resource } from "@fairspec/metadata"
import { getTableData } from "@fairspec/metadata"
import type { LoadTableOptions, TablePlugin } from "../../plugin.ts"
import { loadInlineTable } from "./actions/table/load.ts"

export class InlinePlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await loadInlineTable(resource, options)
  }
}

function getIsInline(resource: Resource) {
  const tableData = getTableData(resource)
  return !!tableData
}
