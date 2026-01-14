import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { validateDescriptor } from "../../actions/descriptor/validate.ts"
import { loadProfile } from "../../actions/profile/load.ts"
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

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : `https://fairspec.org/profiles/latest/table.json`

  const profile = await loadProfile($schema, {
    profileType: "table",
  })

  const report = await validateDescriptor(descriptor, {
    profile,
    rootJsonPointer: options?.rootJsonPointer,
  })

  let tableSchema: TableSchema | undefined
  if (report.valid) {
    // Valid -> we can cast it
    tableSchema = descriptor as TableSchema
  }

  return { ...report, tableSchema }
}
