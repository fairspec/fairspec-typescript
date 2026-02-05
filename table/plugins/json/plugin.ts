import type { Resource } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
import type {
  LoadTableOptions,
  SaveTableOptions,
  Table,
} from "../../models/table.ts"
import type { TablePlugin } from "../../plugin.ts"
import { inferJsonDialect } from "./actions/dialect/infer.ts"
import { loadJsonTable } from "./actions/table/load.ts"
import { saveJsonTable } from "./actions/table/save.ts"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const dialect = await getSupportedDialect(resource, ["json", "jsonl"])
    if (!dialect) return undefined

    return await loadJsonTable({ ...resource, dialect }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const resource = { data: options.path, ...options }

    const dialect = await getSupportedDialect(resource, ["json", "jsonl"])
    if (!dialect) return undefined

    return await saveJsonTable(table, { ...options, dialect })
  }

  async inferDialect(resource: Resource) {
    return await inferJsonDialect(resource)
  }
}
