import type { Descriptor } from "../descriptor/index.ts"
import { inspectJsonValue } from "../jsonSchema/index.ts"
import { createReport } from "../report/index.ts"
import { loadProfile } from "./load.ts"
import type { ProfileType } from "./Profile.ts"

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
