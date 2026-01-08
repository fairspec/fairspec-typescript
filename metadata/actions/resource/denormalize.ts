import { copyDescriptor } from "../descriptor/index.ts"
import { denormalizePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

export function denormalizeResource(
  resource: Resource,
  options: {
    basepath?: string
  },
) {
  const { basepath } = options
  resource = copyDescriptor(resource)

  if (typeof resource.data === "string") {
    resource.data = denormalizePath(resource.data, { basepath })
  }

  if (Array.isArray(resource.data)) {
    for (const [index, path] of resource.data.entries()) {
      if (typeof path === "string") {
        resource.data[index] = denormalizePath(path, { basepath })
      }
    }
  }

  for (const name of ["jsonSchema", "tableSchema"] as const) {
    const property = resource[name]
    if (typeof property === "string") {
      resource[name] = denormalizePath(property, { basepath })
    }
  }

  return resource
}
