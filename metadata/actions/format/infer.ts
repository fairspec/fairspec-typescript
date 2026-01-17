import type { Format } from "../../models/format/format.ts"
import type { Resource } from "../../models/resource.ts"
import { getFileExtension } from "../path/general.ts"
import { getDataFirstPath } from "../resource/data.ts"

export function inferFormatName(
  resource: Partial<Resource>,
): Format["name"] | undefined {
  const path = getDataFirstPath(resource)
  if (!path) return undefined

  const extension = getFileExtension(path)
  if (!extension) return undefined

  switch (extension) {
    case "csv":
      return "csv"
    case "tsv":
      return "tsv"
    case "json":
      return "json"
    case "jsonl":
    case "ndjson":
      return "jsonl"
    case "xlsx":
      return "xlsx"
    case "ods":
      return "ods"
    case "sqlite":
      return "sqlite"
    case "parquet":
      return "parquet"
    case "arrow":
    case "feather":
      return "arrow"
    default:
      return undefined
  }
}
