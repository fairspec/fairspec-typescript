import { loadDescriptor } from "../descriptor/index.ts"
import { assertTableSchema } from "./assert.ts"

/**
 * Load a Schema descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadTableSchema(path: string) {
  const descriptor = await loadDescriptor(path)
  const schema = await assertTableSchema(descriptor)
  return schema
}
