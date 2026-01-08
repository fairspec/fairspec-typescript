import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { validateDescriptor } from "../../actions/descriptor/validate.ts"
import type { Descriptor } from "../../models/descriptor.ts"
import type { TableSchema } from "../../models/tableSchema.ts"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateTableSchema(
  source: TableSchema | Descriptor | string,
  options?: {
    rootJsonPointer?: string
  },
) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const report = await validateDescriptor(descriptor, {
    profileType: "table",
    rootJsonPointer: options?.rootJsonPointer,
  })

  let tableSchema: TableSchema | undefined
  if (report.valid) {
    // Valid -> we can cast it
    tableSchema = descriptor as TableSchema
  }

  return { ...report, tableSchema }
}
