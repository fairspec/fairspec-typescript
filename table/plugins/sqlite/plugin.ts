import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadSqliteTable } from "./actions/table/load.ts"
import { saveSqliteTable } from "./actions/table/save.ts"

export class SqlitePlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const format = getSupportedFormat(resource, ["sqlite"])
    if (!format) return undefined

    return await loadSqliteTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["sqlite"])
    if (!format) return undefined

    return await saveSqliteTable(table, options)
  }
}
