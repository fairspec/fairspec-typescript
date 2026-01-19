import { loadJsonSchema } from "../../actions/jsonSchema/load.ts"

export async function loadDataSchema(path: string) {
  return await loadJsonSchema(path)
}
