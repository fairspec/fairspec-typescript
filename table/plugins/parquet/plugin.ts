import type { Resource } from "@fairspec/metadata"
import { getSupportedFormat } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadParquetTable } from "./actions/table/load.ts"
import { saveParquetTable } from "./actions/table/save.ts"

export class ParquetPlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const format = getSupportedFormat(resource, ["parquet"])
    if (!format) return undefined

    return await loadParquetTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const format = getSupportedFormat(resource, ["parquet"])
    if (!format) return undefined

    return await saveParquetTable(table, options)
  }
}
