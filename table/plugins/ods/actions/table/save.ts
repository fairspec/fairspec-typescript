import { saveFile } from "@fairspec/dataset"
import { utils, write } from "xlsx"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import type { Table } from "../../../../models/table.ts"
import type { SaveTableOptions } from "../../../../plugin.ts"

export async function saveOdsTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite, format } = options

  const odsFormat = format?.type === "ods" ? format : undefined

  const tableSchema =
    options.tableSchema ??
    (await inferTableSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, tableSchema, {
    nativeTypes: ["boolean", "integer", "number", "string"],
  })

  const frame = await table.collect()
  const sheetName = odsFormat?.sheetName ?? "Sheet1"

  const sheet = utils.json_to_sheet(frame.toRecords())
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, sheetName)

  const buffer = write(book, { type: "buffer", bookType: "ods" })
  await saveFile(path, buffer, { overwrite })

  return path
}
