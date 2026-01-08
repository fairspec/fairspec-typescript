import { saveDescriptor } from "../../actions/descriptor/save.ts"
import type { TableSchema } from "../../models/tableSchema.ts"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveTableSchema(
  tableSchema: TableSchema,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  await saveDescriptor(tableSchema, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
