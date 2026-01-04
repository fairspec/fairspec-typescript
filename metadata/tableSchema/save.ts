import { saveDescriptor } from "../descriptor/index.ts"
import type { TableSchema } from "./Schema.ts"

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
