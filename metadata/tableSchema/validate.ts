import type { Descriptor } from "../descriptor/index.ts"
import { loadDescriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { normalizeTableSchema } from "./normalize.ts"
import type { TableSchema } from "./Schema.ts"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateTableSchema(
  source: TableSchema | Descriptor | string,
) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const report = await validateDescriptor(descriptor, { type: "table" })

  let tableSchema: TableSchema | undefined
  if (report.valid) {
    // Validation + normalization = we can cast it
    tableSchema = normalizeTableSchema(descriptor) as TableSchema
  }

  return { ...report, tableSchema }
}
