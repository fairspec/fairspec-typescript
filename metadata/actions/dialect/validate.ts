import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { validateDescriptor } from "../../actions/descriptor/validate.ts"
import { loadProfile } from "../../actions/profile/load.ts"
import type { Descriptor } from "../../models/descriptor.ts"
import type { Dialect } from "../../models/dialect/dialect.ts"

export async function validateDialect(
  source: Dialect | Descriptor | string,
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
      : `https://fairspec.org/profiles/latest/dialect.json`

  const profile = await loadProfile($schema, {
    profileType: "dialect",
  })

  const report = await validateDescriptor(descriptor, {
    profile,
    rootJsonPointer: options?.rootJsonPointer,
  })

  let dialect: Dialect | undefined
  if (report.valid) {
    // Valid -> we can cast it
    dialect = descriptor as Dialect
  }

  return { ...report, dialect }
}
