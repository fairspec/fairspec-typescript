import type { Resource } from "@fairspec/metadata"
import { convertTableSchemaToCkan } from "../../tableSchema/index.ts"
import type { CkanResource } from "../Resource.ts"

export function convertResourceToCkan(resource: Resource) {
  const ckanResource: Partial<CkanResource> = {}

  if (resource.name) {
    ckanResource.name = resource.name
  }

  if (resource.descriptions?.[0]?.description) {
    ckanResource.description = resource.descriptions[0].description
  }

  if (resource.integrity?.hash) {
    ckanResource.hash = resource.integrity.hash
  }

  const createdDate = resource.dates?.find(d => d.dateType === "Created")
  if (createdDate) {
    ckanResource.created = createdDate.date
  }

  const updatedDate = resource.dates?.find(d => d.dateType === "Updated")
  if (updatedDate) {
    ckanResource.last_modified = updatedDate.date
  }

  if (resource.tableSchema && typeof resource.tableSchema === "object") {
    ckanResource.schema = convertTableSchemaToCkan(resource.tableSchema)
  }

  return ckanResource
}
