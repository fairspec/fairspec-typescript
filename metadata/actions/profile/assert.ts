import type { JsonSchema } from "../../models/jsonSchema.ts"
import type { Profile, ProfileType } from "./types.ts"

export async function assertProfile(
  jsonSchema: JsonSchema,
  options: {
    path: string
    type: ProfileType
  },
) {
  const regex = new RegExp(
    `^https:\\/\\/fairspec\\.org\\/profiles\\/(\\d+\\.\\d+\\.\\d+|latest)\\/${options.type}\\.json$`,
  )

  // Main profile path + extension's base profiles
  const paths = [options.path]
  if (Array.isArray(jsonSchema.allOf)) {
    for (const ref of Object.values(jsonSchema.allOf)) {
      paths.push(ref)
    }
  }

  // If one of the paths matches the profile type, we're good
  for (const path of paths) {
    if (regex.test(path)) {
      return jsonSchema as Profile
    }
  }

  throw new Error(
    `Profile at path ${options.path} is not a valid ${options.type} profile`,
  )
}
