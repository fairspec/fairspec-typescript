import type { Descriptor } from "../descriptor/index.ts"

export function normalizeTableSchema(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)
  return descriptor
}
