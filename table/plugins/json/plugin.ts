import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadJsonTable } from "./actions/table/load.ts"
import { saveJsonTable } from "./actions/table/save.ts"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const format = getSupportedFormat(resource, ["json", "jsonl"])
    if (!format) return undefined

    return await loadJsonTable({ ...resource, format }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["json", "jsonl"])
    if (!format) return undefined

    return await saveJsonTable(table, { ...options, format })
  }
}
