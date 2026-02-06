import { saveFile } from "@fairspec/dataset"
import { getSupportedDialect } from "@fairspec/metadata"
import { utils, write } from "xlsx"
import { denormalizeTable } from "../../../../actions/table/denormalize.ts"
import { inferTableSchemaFromTable } from "../../../../actions/tableSchema/infer.ts"
import type { SaveTableOptions, Table } from "../../../../models/table.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function saveXlsxTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const resource = { data: path, dialect: options.dialect }
  const dialect = await getSupportedDialect(resource, ["xlsx", "ods"])
  if (!dialect) {
    throw new Error("Saving options is not compatible")
  }

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
  const sheetName = dialect?.sheetName ?? "Sheet1"

  const sheet = utils.json_to_sheet(frame.toRecords())
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, sheetName)

  const bookType = dialect?.format === "ods" ? "ods" : "xlsx"
  const buffer = write(book, { type: "buffer", bookType })
  await saveFile(path, buffer, { overwrite })

  return path
}
