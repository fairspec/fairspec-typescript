import { saveFile } from "@fairspec/dataset"
import type { JsonFormat, JsonlFormat } from "@fairspec/metadata"
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

function processData(
  records: Record<string, any>[],
  format: JsonFormat | JsonlFormat,
) {
  let data: any = records

  if (format.columnNames) {
    const names = format.columnNames
    data = data.map((row: any) =>
      Object.fromEntries(names.map((name: any) => [name, row[name]])),
    )
  }

  if (format.rowType === "array") {
    const names = format.columnNames ?? Object.keys(data[0])
    data = [
      names,
      ...data.map((row: any) => names.map((nmae: any) => row[nmae])),
    ]
  }

  if (format.type === "json") {
    if (format.jsonPointer) {
      // TODO: cover more jsonPointer cases
      data = { [format.jsonPointer]: data }
    }
  }

  return data
}
