import type { Descriptor } from "../descriptor/index.ts"
import { denormalizePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

export function denormalizeResource(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  resource = globalThis.structuredClone(resource)
  denormalizeResourcePaths(resource, options)
  return resource as Descriptor
}

function denormalizeResourcePaths(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  const basepath = options?.basepath

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? resource.path.map(path => denormalizePath(path, { basepath }))
      : denormalizePath(resource.path, { basepath })
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof resource[name] === "string") {
      resource[name] = denormalizePath(resource[name], { basepath })
    }
  }
}
