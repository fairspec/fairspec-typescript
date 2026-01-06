import type { Descriptor } from "./Descriptor.ts"

export function isDescriptor(value: unknown): value is Descriptor {
  return !!value && typeof value === "object" && !Array.isArray(value)
}
