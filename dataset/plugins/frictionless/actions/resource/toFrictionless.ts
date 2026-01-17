import type { Resource } from "@fairspec/metadata"
import type { FrictionlessResource } from "../../models/resource.ts"
import { convertTableSchemaToFrictionless } from "../tableSchema/toFrictionless.ts"

export function convertResourceToFrictionless(
  resource: Resource,
): FrictionlessResource {
  const frictionlessResource: FrictionlessResource = {
    name: resource.name ?? "resource",
  }

  if (typeof resource.data === "string") {
    frictionlessResource.path = resource.data
  } else {
    frictionlessResource.data = resource.data
  }

  if (resource.format) {
    frictionlessResource.format = resource.format.name
  }

  if (resource.integrity) {
    frictionlessResource.hash = `${resource.integrity.type}:${resource.integrity.hash}`
  }

  if (resource.tableSchema) {
    if (typeof resource.tableSchema === "string") {
      frictionlessResource.schema = resource.tableSchema
    } else {
      frictionlessResource.schema = convertTableSchemaToFrictionless(
        resource.tableSchema,
      )
    }
  }

  if (resource.dataSchema) {
    frictionlessResource.jsonSchema = resource.dataSchema
  }

  if (resource.titles && resource.titles.length > 0) {
    const firstTitle = resource.titles[0]
    if (firstTitle) {
      frictionlessResource.title = firstTitle.title
    }
  }

  if (resource.descriptions && resource.descriptions.length > 0) {
    const firstDesc = resource.descriptions[0]
    if (firstDesc) {
      frictionlessResource.description = firstDesc.description
    }
  }

  if (resource.rightsList && resource.rightsList.length > 0) {
    frictionlessResource.licenses = resource.rightsList.map(rights => ({
      name: rights.rights,
      path: rights.rightsUri,
    }))
  }

  if (resource.sizes && resource.sizes.length > 0) {
    const sizeStr = resource.sizes[0]
    if (sizeStr) {
      const match = sizeStr.match(/^(\d+)\s*bytes?$/i)
      if (match?.[1]) {
        frictionlessResource.bytes = Number.parseInt(match[1], 10)
      }
    }
  }

  return frictionlessResource
}
