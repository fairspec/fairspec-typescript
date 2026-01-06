import { saveDescriptor } from "../descriptor/index.ts"
import { denormalizeTableSchema } from "./denormalize.ts"
import type { TableSchema } from "./TableSchema.ts"

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
  const descriptor = denormalizeTableSchema(tableSchema)

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
