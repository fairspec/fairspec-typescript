import { saveFile } from "@fairspec/dataset"
import type { JsonDialect, JsonlDialect } from "@fairspec/metadata"
import { getSupportedDialect } from "@fairspec/metadata"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"
import { decodeJsonBuffer } from "../../actions/buffer/decode.ts"
import { encodeJsonBuffer } from "../../actions/buffer/encode.ts"

export async function saveJsonTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const dialect = await getSupportedDialect(options, ["json", "jsonl"])
  if (!dialect) {
    throw new Error("Saving options is not compatible")
  }

  const isLines = dialect?.format === "jsonl"

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

  if (dialect) {
    data = processData(data, dialect)
  }

  buffer = encodeJsonBuffer(data, { isLines })
  await saveFile(path, buffer, { overwrite })

  return path
}

function processData(
  records: Record<string, any>[],
  dialect: JsonDialect | JsonlDialect,
) {
  let data: any = records

  if (dialect.columnNames) {
    const names = dialect.columnNames
    data = data.map((row: any) =>
      Object.fromEntries(names.map((name: any) => [name, row[name]])),
    )
  }

  if (dialect.rowType === "array") {
    const names = dialect.columnNames ?? Object.keys(data[0])
    data = [
      names,
      ...data.map((row: any) => names.map((nmae: any) => row[nmae])),
    ]
  }

  if (dialect.format === "json") {
    if (dialect.jsonPointer) {
      // TODO: cover more jsonPointer cases
      data = { [dialect.jsonPointer]: data }
    }
  }

  return data
}
