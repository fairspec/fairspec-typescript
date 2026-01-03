import type { Descriptor } from "../../descriptor/index.ts"

export function convertTableSchemaFromDescriptor(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)
  return descriptor
}
