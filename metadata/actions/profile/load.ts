import { loadJsonSchema } from "../../actions/jsonSchema/load.ts"
import { assertProfile } from "./assert.ts"
import { profileRegistry } from "./registry.ts"
import type { ProfileType } from "../../models/profile.ts"

export async function loadProfile(path: string, options: { profileType: ProfileType }) {
  let jsonSchema = profileRegistry.find(profile => profile.path === path)?.profile

  if (!jsonSchema) {
    jsonSchema = await loadJsonSchema(path)
  }

  return await assertProfile(jsonSchema, { path, type: options.profileType })
}
