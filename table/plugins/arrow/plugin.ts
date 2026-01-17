import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
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
    const format = getSupportedFormat(resource, ["arrow"])
    if (!format) return undefined

    return await loadArrowTable({ ...resource, format }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["arrow"])
    if (!format) return undefined

    return await saveArrowTable(table, { ...options, format })
  }
}
