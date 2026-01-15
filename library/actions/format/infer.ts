import type { InferFormatOptions } from "@fairspec/dataset"
import type { Resource } from "@fairspec/metadata"
import { system } from "../../system.ts"

// TODO: review default values being {} vs undefined

export async function inferFormat(
  resource: Partial<Resource>,
  options?: InferFormatOptions,
) {
  for (const plugin of system.plugins) {
    const format = await plugin.inferFormat?.(resource, options)
    if (format) {
      return format
    }
  }

  return undefined
}
