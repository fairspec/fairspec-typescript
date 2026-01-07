import type { Descriptor } from "../descriptor/index.ts"
import { copyDescriptor } from "../descriptor/index.ts"

export function normalizeTableSchema(descriptor: Descriptor) {
  return copyDescriptor(descriptor)
}
