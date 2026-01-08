import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { assertTableSchema } from "./assert.ts"

/**
 * Load a Table Schema descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadTableSchema(path: string) {
  const descriptor = await loadDescriptor(path)
  const tableSchema = await assertTableSchema(descriptor)
  return tableSchema
}
