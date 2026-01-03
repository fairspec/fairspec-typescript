import { saveDescriptor } from "../descriptor/index.ts"
import { convertTableSchemaToDescriptor } from "./convert/toDescriptor.ts"
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
  const descriptor = convertTableSchemaToDescriptor(tableSchema)

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
