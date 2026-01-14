import type { Resource } from "@fairspec/metadata"
import { resolveTableSchema } from "@fairspec/metadata"
import { loadFile, prefetchFiles } from "@fairspec/dataset"
import type { LoadTableOptions } from "../../../../plugin.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import { normalizeTable } from "../../../../actions/table/normalize.ts"
import type { Table } from "../../../../models/table.ts"
import * as pl from "nodejs-polars"
import { decodeJsonBuffer } from "../../actions/buffer/decode.ts"

export async function loadJsonTable(
  resource: Partial<Resource> & { format?: "json" | "jsonl" | "ndjson"; dialect?: any },
  options?: LoadTableOptions,
) {
  const isLines = resource.format === "jsonl" || resource.format === "ndjson"

  const paths = await prefetchFiles(resource)
  if (!paths.length) {
    throw new Error("Resource data is not defined")
  }

  const dialect = resource.dialect

  const tables: Table[] = []
  for (const path of paths) {
    if (isLines && !dialect) {
      const table = pl.scanJson(path)
      tables.push(table)
      continue
    }

    const buffer = await loadFile(path)
    let data = decodeJsonBuffer(buffer, { isLines })
    if (dialect) {
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

function processData(data: any, dialect: any) {
  if (dialect.property) {
    data = data[dialect.property]
  }

  if (dialect.itemType === "array") {
    const keys = data[0]

    data = data
      .slice(1)
      .map((row: any) =>
        Object.fromEntries(
          keys.map((key: any, index: number) => [key, row[index]]),
        ),
      )
  }

  if (dialect.itemKeys) {
    const keys = dialect.itemKeys

    data = data.map((row: any) =>
      Object.fromEntries(keys.map((key: any) => [key, row[key]])),
    )
  }

  return data
}
