import type { Resource } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
import type {
  LoadTableOptions,
  SaveTableOptions,
  Table,
} from "../../models/table.ts"
import type { TablePlugin } from "../../plugin.ts"
import { inferXlsxDialect } from "./actions/dialect/infer.ts"
import { loadXlsxTable } from "./actions/table/load.ts"
import { saveXlsxTable } from "./actions/table/save.ts"

export class XlsxPlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const dialect = await getSupportedDialect(resource, ["xlsx", "ods"])
    if (!dialect) return undefined

    return await loadXlsxTable({ ...resource, dialect }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const dialect = await getSupportedDialect(resource, ["xlsx", "ods"])
    if (!dialect) return undefined

    return await saveXlsxTable(table, { ...options, dialect })
  }

  async inferDialect(resource: Resource) {
    const dialect = await getSupportedDialect(resource, ["xlsx", "ods"])
    if (!dialect) return undefined

    return await inferXlsxDialect(resource)
  }
}
