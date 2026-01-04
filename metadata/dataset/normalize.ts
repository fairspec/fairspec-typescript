import type { Descriptor } from "../descriptor/index.ts"
import { normalizePath } from "../path/index.ts"

export function normalizeResource(
  descriptor: Descriptor,
  options?: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)
  normalizeResourcePaths(descriptor, options)
  return descriptor
}

function normalizeResourcePaths(
  descriptor: Descriptor,
  options?: { basepath?: string },
) {
  const basepath = options?.basepath

  if (typeof descriptor.path === "string") {
    descriptor.path = normalizePath(descriptor.path, { basepath })
  }

  if (Array.isArray(descriptor.path)) {
    for (const [index, path] of descriptor.path.entries()) {
      descriptor.path[index] = normalizePath(path, { basepath })
    }
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof descriptor[name] === "string") {
      descriptor[name] = normalizePath(descriptor[name], {
        basepath,
      })
    }
  }
}
