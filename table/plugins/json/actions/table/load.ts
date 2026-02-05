import type { Resource } from "@fairspec/metadata"
import type { JsonDialect, JsonlDialect } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { loadFile, prefetchFiles } from "@fairspec/dataset"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import type { Table } from "../../../../models/table.ts"
import * as pl from "nodejs-polars"
import { decodeJsonBuffer } from "../../actions/buffer/decode.ts"
import { getSupportedDialect } from "@fairspec/metadata"
import { inferJsonDialect } from "../dialect/infer.ts"

export async function loadJsonTable(
  resource: Resource,
  options?: LoadTableOptions,
) {
  let dialect = await getSupportedDialect(resource, ["json", "jsonl"])
  if (!dialect) {
    throw new Error("Resource data is not compatible")
  }

  const maxBytes = dialect?.format === "jsonl" ? options?.previewBytes : undefined
  const paths = await prefetchFiles(resource, {maxBytes})
  if (!paths.length) {
    throw new Error("Resource data is not defined")
  }

  // TODO: Consider inferring all the missing dialect properties
  if (!dialect || Object.keys(dialect).length <= 1) {
    dialect = await inferJsonDialect({ ...resource, data: paths[0] })
  }

  const isLines = dialect?.format === "jsonl"
  const isDefault = Object.keys(dialect ?? {})
    .filter(key => !['type', 'title', 'description'].includes(key)).length === 0


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
      data = processData(data, dialect)
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
function processData(data: any, dialect?: JsonDialect | JsonlDialect) {
  if (dialect?.format === 'json' && dialect?.jsonPointer) {
    data = data[dialect.jsonPointer]
  }

  if (dialect?.rowType === "array") {
    const keys = data[0]

    data = data
      .slice(1)
      .map((row: any) =>
        Object.fromEntries(
          keys.map((key: any, index: number) => [key, row[index]]),
        ),
      )
  }

  if (dialect?.columnNames) {
    const columnNames = dialect.columnNames

    data = data.map((row: any) =>
      Object.fromEntries(columnNames.map((name: any) => [name, row[name]])),
    )
  }

  return data
}
