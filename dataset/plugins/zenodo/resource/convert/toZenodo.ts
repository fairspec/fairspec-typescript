import type { Resource } from "@fairspec/metadata"
import type { ZenodoResource } from "../Resource.ts"

export function convertResourceToZenodo(resource: Resource) {
  const zenodoResource: Partial<ZenodoResource> = {
    key: resource.name,
  }

  if (resource.integrity && resource.integrity.type === "md5") {
    zenodoResource.checksum = `md5:${resource.integrity.hash}`
  }

  return zenodoResource
}
