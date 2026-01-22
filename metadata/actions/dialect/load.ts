import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { assertDialect } from "./assert.ts"

export async function loadDialect(path: string) {
  const descriptor = await loadDescriptor(path)
  const dialect = await assertDialect(descriptor)
  return dialect
}
