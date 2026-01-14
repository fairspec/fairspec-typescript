import type { Resource } from "@fairspec/metadata"
import { getDataPaths, getFileExtension } from "@fairspec/metadata"
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
    const jsonFormat = getJsonFormat(resource)
    if (!jsonFormat) return undefined

    return await loadJsonTable({ ...resource, format: jsonFormat }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const formatObject = format ? { type: format } : undefined
    const jsonFormat = getJsonFormat({ data: path, format: formatObject })
    if (!jsonFormat) return undefined

    return await saveJsonTable(table, { ...options, format: jsonFormat })
  }
}

function getJsonFormat(resource: Partial<Resource>) {
  if (resource.format?.type === "json") return "json"
  if (resource.format?.type === "jsonl") return "jsonl"

  const paths = getDataPaths(resource)
  const firstPath = paths[0]
  if (!firstPath) return undefined

  const extension = getFileExtension(firstPath)
  if (extension === "json") return "json"
  if (extension === "jsonl" || extension === "ndjson") return "jsonl"
  return undefined
}
