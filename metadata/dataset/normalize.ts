import type { Descriptor } from "../descriptor/index.ts"
import { normalizeJsonSchema } from "../jsonSchema/index.ts"
import { normalizePath } from "../path/index.ts"
import { normalizeTableSchema } from "../tableSchema/index.ts"

export function normalizeDataset(
  descriptor: Descriptor,
  options?: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)

  if (Array.isArray(descriptor.resources)) {
    // TODO: why resource is any here?
    for (const resource of descriptor.resources) {
      normalizeResourceData(resource, options)
      normalizeResourceJsonSchema(resource, options)
      normalizeResourceTableSchema(resource, options)
    }
  }

  return descriptor
}

function normalizeResourceData(
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
}

function normalizeResourceJsonSchema(
  descriptor: Descriptor,
  options?: { basepath?: string },
) {
  const basepath = options?.basepath

  if (typeof descriptor.jsonSchema === "string") {
    descriptor.jsonSchema = normalizePath(descriptor.jsonSchema, { basepath })
  } else if (descriptor.jsonSchema) {
    // TODO: fix
    // @ts-expect-error
    descriptor.jsonSchema = normalizeJsonSchema(descriptor.jsonSchema)
  }
}

function normalizeResourceTableSchema(
  descriptor: Descriptor,
  options?: { basepath?: string },
) {
  const basepath = options?.basepath

  if (typeof descriptor.tableSchema === "string") {
    descriptor.tableSchema = normalizePath(descriptor.tableSchema, { basepath })
  } else if (descriptor.tableSchema) {
    // TODO: fix
    // @ts-expect-error
    descriptor.tableSchema = normalizeTableSchema(descriptor.tableSchema)
  }
}
