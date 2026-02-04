import type { Resource } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
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
    const dialect = await getSupportedDialect(resource, ["parquet"])
    if (!dialect) return undefined

    return await loadParquetTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const dialect = await getSupportedDialect(resource, ["parquet"])
    if (!dialect) return undefined

    return await saveParquetTable(table, options)
  }

  async inferDialect(resource: Resource) {
    const dialect = await getSupportedDialect(resource, ["parquet"])
    if (!dialect) return undefined

    return { format: "parquet" }
  }
}
