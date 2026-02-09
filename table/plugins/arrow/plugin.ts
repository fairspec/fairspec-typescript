import type { Resource } from "@fairspec/metadata"
import { getSupportedFileDialect } from "@fairspec/metadata"
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
    const dialect = await getSupportedFileDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return await loadArrowTable({ ...resource, fileDialect: dialect }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const dialect = await getSupportedFileDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return await saveArrowTable(table, { ...options, fileDialect: dialect })
  }

  async inferFileDialect(resource: Resource) {
    const dialect = await getSupportedFileDialect(resource, ["arrow"])
    if (!dialect) return undefined

    return { format: dialect.format }
  }
}
