import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
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
    const format = getSupportedFormat(resource, ["ods"])
    if (!format) return undefined

    return await loadOdsTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["ods"])
    if (!format) return undefined

    return await saveOdsTable(table, options)
  }
}
