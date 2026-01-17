import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
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
    const format = getSupportedFormat(resource, ["xlsx"])
    if (!format) return undefined

    return await loadXlsxTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["xlsx"])
    if (!format) return undefined

    return await saveXlsxTable(table, options)
  }
}
