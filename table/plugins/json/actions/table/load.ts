import type { Resource } from "@fairspec/metadata"
import type { JsonFormat, JsonlFormat } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { loadFile, prefetchFiles } from "@fairspec/dataset"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import type { Table } from "../../../../models/table.ts"
import * as pl from "nodejs-polars"
import { decodeJsonBuffer } from "../../actions/buffer/decode.ts"

export async function loadJsonTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const format = resource.format?.type === "json" || resource.format?.type === "jsonl"
    ? resource.format
    : undefined

  const isLines = format?.type === "jsonl"
  const isDefault = Object.keys(format ?? {})
    .filter(key => !['type', 'title', 'description'].includes(key)).length === 0


  const paths = await prefetchFiles(resource)
  if (!paths.length) {
    throw new Error("Resource data is not defined")
  }

  const tables: Table[] = []
  for (const path of paths) {
    if (isLines && isDefault) {
      const table = pl.scanJson(path)
      tables.push(table)
      continue
    }

    const buffer = await loadFile(path)
    let data = decodeJsonBuffer(buffer, { isLines })
    if (!isDefault) {
      data = processData(data, format)
    }

    const table = pl.DataFrame(data).lazy()
    tables.push(table)
  }

  let table = pl.concat(tables)

  if (!options?.denormalized) {
    let tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) tableSchema = await inferTableSchemaFromTable(table, options)
    table = await normalizeTable(table, tableSchema)
  }

  return table
}

// TODO: Make data unkonwn not any!
function processData(data: any, format?: JsonFormat | JsonlFormat) {
  if (format?.type === 'json' && format?.jsonPointer) {
    data = data[format.jsonPointer]
  }

  if (format?.rowType === "array") {
    const keys = data[0]

    data = data
      .slice(1)
      .map((row: any) =>
        Object.fromEntries(
          keys.map((key: any, index: number) => [key, row[index]]),
        ),
      )
  }

  if (format?.columnNames) {
    const columnNames = format.columnNames

    data = data.map((row: any) =>
      Object.fromEntries(columnNames.map((name: any) => [name, row[name]])),
    )
  }

  return data
}
