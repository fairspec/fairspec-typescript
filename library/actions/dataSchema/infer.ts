import type { JsonSchema, Resource } from "@fairspec/metadata"
import { inferSchema } from "@jsonhero/schema-infer"
import { loadData } from "../../actions/data/load.ts"

export async function inferDataSchema(resource: Partial<Resource>) {
  const data = await loadData(resource)
  if (!data) {
    return undefined
  }

  try {
    return inferSchema(data).toJSONSchema() as JsonSchema
  } catch {
    return undefined
  }
}
