import type { Descriptor } from "../descriptor/index.ts"
import { copyDescriptor } from "../descriptor/index.ts"

export function normalizeJsonSchema(descriptor: Descriptor) {
  return copyDescriptor(descriptor)
}
