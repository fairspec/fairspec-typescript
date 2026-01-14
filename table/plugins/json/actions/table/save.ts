import { saveFile } from "@fairspec/dataset"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"
import { decodeJsonBuffer } from "../../actions/buffer/decode.ts"
import { encodeJsonBuffer } from "../../actions/buffer/encode.ts"

export async function saveJsonTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const jsonFormat =
    options.format?.type === "json" ? options.format : undefined
  const jsonlFormat =
    options.format?.type === "jsonl" ? options.format : undefined
  const format = jsonFormat ?? jsonlFormat

  const isLines = format?.type === "jsonl"

  const tableSchema =
    options.tableSchema ??
    (await inferTableSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, tableSchema, {
    nativeTypes: ["boolean", "integer", "list", "number", "string"],
  })

  const frame = await table.collect()
  let buffer = frame.writeJSON({ format: isLines ? "lines" : "json" })
  let data = decodeJsonBuffer(buffer, { isLines })

  if (format) {
    data = processData(data, format)
  }

  buffer = encodeJsonBuffer(data, { isLines })
  await saveFile(path, buffer, { overwrite })

  return path
}

function processData(records: Record<string, any>[], dialect: any) {
  let data: any = records

  if (dialect.itemKeys) {
    const keys = dialect.itemKeys
    data = data.map((row: any) =>
      Object.fromEntries(keys.map((key: any) => [key, row[key]])),
    )
  }

  if (dialect.itemType === "array") {
    const keys = dialect.itemKeys ?? Object.keys(data[0])
    data = [keys, ...data.map((row: any) => keys.map((key: any) => row[key]))]
  }

  if (dialect.property) {
    data = { [dialect.property]: data }
  }

  return data
}
