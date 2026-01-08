import { copyDescriptor } from "../descriptor/index.ts"
import { normalizePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

export function normalizeResource(
  resource: Resource,
  options: {
    basepath?: string
  },
) {
  const { basepath } = options
  resource = copyDescriptor(resource)

  if (typeof resource.data === "string") {
    resource.data = normalizePath(resource.data, { basepath })
  }

  if (Array.isArray(resource.data)) {
    for (const [index, path] of resource.data.entries()) {
      if (typeof path === "string") {
        resource.data[index] = normalizePath(path, { basepath })
      }
    }
  }

  for (const name of ["jsonSchema", "tableSchema"] as const) {
    const property = resource[name]
    if (typeof property === "string") {
      resource[name] = normalizePath(property, { basepath })
    }
  }

  return resource
}
