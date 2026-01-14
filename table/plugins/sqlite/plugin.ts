import type { Resource } from "@fairspec/metadata"
import { getFileExtension, getFirstDataPath } from "@fairspec/metadata"
import type { Table } from "../../models/table.ts"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import { loadSqliteTable } from "./actions/table/load.ts"
import { saveSqliteTable } from "./actions/table/save.ts"

export class SqlitePlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isSqlite = getIsSqlite(resource)
    if (!isSqlite) return undefined

    return await loadSqliteTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isSqlite = getIsSqlite({ data: path, format })
    if (!isSqlite) return undefined

    return await saveSqliteTable(table, options)
  }
}

function getIsSqlite(resource: Partial<Resource>) {
  if (resource.format?.type === "sqlite") return true

  const firstPath = getFirstDataPath(resource)
  if (!firstPath) return false

  const extension = getFileExtension(firstPath)
  return extension === "sqlite"
}
