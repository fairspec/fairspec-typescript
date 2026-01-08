import type { Descriptor } from "./Descriptor.ts"

export function copyDescriptor<T extends Descriptor>(descriptor: T) {
  return globalThis.structuredClone(descriptor)
}
