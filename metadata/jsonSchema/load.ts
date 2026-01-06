import { loadDescriptor } from "../descriptor/index.ts"
import { cache } from "./cache.ts"
import { assertJsonSchema } from "./assert.ts"

export async function loadJsonSchema(
  path: string,
  options?: { onlyRemote?: boolean },
) {
  let jsonSchema = cache.get(path)

  if (!jsonSchema) {
    const { profileRegistry } = await import("../profile/index.ts")
    for (const item of profileRegistry) {
      if (item.path === path) {
        jsonSchema = item.profile
        break
      }
    }
  }

  if (!jsonSchema) {
    const descriptor = await loadDescriptor(path, options)
    jsonSchema = await assertJsonSchema(descriptor)
    cache.set(path, jsonSchema)
  }

  return jsonSchema
}
