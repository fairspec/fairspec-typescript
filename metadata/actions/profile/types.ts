import type { JsonSchema } from "../../models/jsonSchema.ts"

export type Profile = JsonSchema
export type ProfileType = "catalog" | "dataset" | "table"
export type ProfileRegistry = {
  type: ProfileType
  path: string
  version: string
  profile: Profile
}[]
