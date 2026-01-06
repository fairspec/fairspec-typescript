import type { Descriptor } from "../descriptor/index.ts"

export function normalizeJsonSchema(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)
  return descriptor
}
