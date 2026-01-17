import type { Resource } from "@fairspec/metadata"
import { getDataRecords } from "@fairspec/metadata"
import type { LoadTableOptions, TablePlugin } from "../../plugin.ts"
import { loadInlineTable } from "./actions/table/load.ts"

export class InlinePlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const records = getDataRecords(resource)
    if (!records) return undefined

    return await loadInlineTable(resource, options)
  }
}
