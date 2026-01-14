import type { Resource } from "@fairspec/metadata"
import { getDataPaths, getFileExtension } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadParquetTable } from "./actions/table/load.ts"
import { saveParquetTable } from "./actions/table/save.ts"

export class ParquetPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isParquet = getIsParquet(resource)
    if (!isParquet) return undefined

    return await loadParquetTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isParquet = getIsParquet({ data: path, format })
    if (!isParquet) return undefined

    return await saveParquetTable(table, options)
  }
}

function getIsParquet(resource: Partial<Resource>) {
  if (resource.format?.type === "parquet") return true

  const paths = getDataPaths(resource)
  const firstPath = paths[0]
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "parquet"
}
