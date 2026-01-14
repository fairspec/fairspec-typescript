import type { Resource } from "@fairspec/metadata"
import {
  getFileExtension,
  getFirstDataPath,
  type JsonFormat,
  type JsonlFormat,
} from "@fairspec/metadata"
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
    const format = getSupportedFormat(resource)
    if (!format) return undefined

    return await loadJsonTable({ ...resource, format }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path } = options

    const format = getSupportedFormat({ data: path, ...options })
    if (!format) return undefined

    return await saveJsonTable(table, { ...options, format })
  }
}

function getSupportedFormat(resource: Partial<Resource>) {
  if (resource.format?.type === "csv" || resource.format?.type === "tsv") {
    return resource.format
  }

  const firstPath = getFirstDataPath(resource)
  if (!firstPath) return undefined

  const extension = getFileExtension(firstPath)
  const format: JsonFormat | JsonlFormat | undefined =
    extension === "json" || extension === "jsonl"
      ? { type: extension }
      : undefined

  return format
}
