import { inspectJsonValue } from "../../actions/jsonSchema/inspect/value.ts"
import { loadProfile } from "../../actions/profile/load.ts"
import { createReport } from "../../actions/report/create.ts"
import type { Descriptor } from "../../models/descriptor.ts"
import type { ProfileType } from "../../models/profile.ts"

export async function validateDescriptor(
  descriptor: Descriptor,
  options: {
    profileType: ProfileType
    rootJsonPointer?: string
  },
) {
  const $schema =
    typeof descriptor.$schema === "string" ? descriptor.$schema : undefined

  if (!$schema) {
    return createReport([
      {
        type: "metadata",
        message: "Must have required property $schema at /",
        jsonPointer: "$schema",
      },
    ])
  }

  const profile = await loadProfile($schema, {
    profileType: options.profileType,
  })

  const errors = await inspectJsonValue(descriptor, {
    jsonSchema: profile,
    rootJsonPointer: options.rootJsonPointer,
  })

  return createReport(
    errors.map(error => ({
      type: "metadata",
      ...error,
    })),
  )
}
