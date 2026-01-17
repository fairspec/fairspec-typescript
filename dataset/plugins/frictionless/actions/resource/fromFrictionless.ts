import type { Resource } from "@fairspec/metadata"
import type { FrictionlessResource } from "../../models/resource.ts"
import { convertTableSchemaFromFrictionless } from "../tableSchema/fromFrictionless.ts"

export function convertResourceFromFrictionless(
  frictionlessResource: FrictionlessResource,
): Resource {
  if (!frictionlessResource.path && !frictionlessResource.data) {
    throw new Error("Resource must have either path or data")
  }

  const data = (frictionlessResource.path ?? frictionlessResource.data) as
    | string
    | string[]
    | Record<string, unknown>
    | Record<string, unknown>[]

  const resource: Resource = {
    data,
    name: frictionlessResource.name,
  }

  if (frictionlessResource.format) {
    const format = convertFormatString(frictionlessResource.format)
    if (format) {
      resource.format = format
    }
  }

  if (frictionlessResource.hash) {
    const integrity = parseHashToIntegrity(frictionlessResource.hash)
    if (integrity) {
      resource.integrity = integrity
    }
  }

  if (frictionlessResource.schema) {
    if (typeof frictionlessResource.schema === "object") {
      resource.tableSchema = convertTableSchemaFromFrictionless(
        frictionlessResource.schema,
      )
    } else {
      resource.tableSchema = frictionlessResource.schema
    }
  }

  if (frictionlessResource.jsonSchema) {
    resource.dataSchema = frictionlessResource.jsonSchema
  }

  if (frictionlessResource.title) {
    resource.titles = [{ title: frictionlessResource.title }]
  }

  if (frictionlessResource.description) {
    resource.descriptions = [
      {
        description: frictionlessResource.description,
        descriptionType: "Abstract" as const,
      },
    ]
  }

  if (
    frictionlessResource.licenses &&
    frictionlessResource.licenses.length > 0
  ) {
    resource.rightsList = frictionlessResource.licenses.map(license => ({
      rights: license.name ?? license.title,
      rightsUri: license.path,
    }))
  }

  if (frictionlessResource.bytes !== undefined) {
    resource.sizes = [`${frictionlessResource.bytes} bytes`]
  }

  return resource
}

function convertFormatString(
  formatString: string,
):
  | { name: "csv" }
  | { name: "tsv" }
  | { name: "json" }
  | { name: "jsonl" }
  | { name: "xlsx" }
  | { name: "ods" }
  | { name: "sqlite" }
  | { name: "parquet" }
  | { name: "arrow" }
  | undefined {
  const normalized = formatString.toLowerCase()
  switch (normalized) {
    case "csv":
      return { name: "csv" }
    case "tsv":
      return { name: "tsv" }
    case "json":
      return { name: "json" }
    case "jsonl":
    case "ndjson":
      return { name: "jsonl" }
    case "xlsx":
      return { name: "xlsx" }
    case "ods":
      return { name: "ods" }
    case "sqlite":
    case "sqlite3":
      return { name: "sqlite" }
    case "parquet":
      return { name: "parquet" }
    case "arrow":
      return { name: "arrow" }
    default:
      return undefined
  }
}

function parseHashToIntegrity(
  hash: string,
): { type: "md5" | "sha1" | "sha256" | "sha512"; hash: string } | undefined {
  const match = hash.match(/^(md5|sha1|sha256|sha512):(.+)$/i)
  if (!match || !match[1] || !match[2]) {
    return undefined
  }
  return {
    type: match[1].toLowerCase() as "md5" | "sha1" | "sha256" | "sha512",
    hash: match[2],
  }
}
