import type { Resource } from "@fairspec/metadata"
import { getFileNameSlug } from "@fairspec/metadata"
import type { ZenodoResource } from "../Resource.ts"

export function convertResourceFromZenodo(zenodoResource: ZenodoResource) {
  const path = convertPath(zenodoResource.links.self)

  const resource: Resource = {
    data: path,
    name: getFileNameSlug(zenodoResource.key) ?? zenodoResource.id,
    integrity: {
      type: "md5",
      hash: zenodoResource.checksum.replace("md5:", ""),
    },
    unstable_customMetadata: {
      zenodoKey: zenodoResource.key,
      zenodoUrl: path,
    },
  }

  return resource
}

function convertPath(link: string) {
  return link.replace("/api/", "/").replace(/\/content$/, "")
}
