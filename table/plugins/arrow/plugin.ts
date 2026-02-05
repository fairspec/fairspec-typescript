import type { Resource } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
import type {
  LoadTableOptions,
  SaveTableOptions,
  Table,
} from "../../models/table.ts"
import type { TablePlugin } from "../../plugin.ts"
import { loadArrowTable } from "./actions/table/load.ts"
import { saveArrowTable } from "./actions/table/save.ts"

export class ArrowPlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const dialect = await getSupportedDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return await loadArrowTable({ ...resource, dialect }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const dialect = await getSupportedDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return await saveArrowTable(table, { ...options, dialect })
  }

  async inferDialect(resource: Resource) {
    const dialect = await getSupportedDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return { format: dialect.format }
  }
}
