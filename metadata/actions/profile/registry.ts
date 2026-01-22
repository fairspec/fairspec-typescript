import type { ProfileRegistry } from "../../models/profile.ts"
import catalogProfile from "../../profiles/catalog.json" with { type: "json" }
import datasetProfile from "../../profiles/dataset.json" with { type: "json" }
import dialectProfile from "../../profiles/dialect.json" with { type: "json" }
import schemaProfile from "../../profiles/schema.json" with { type: "json" }

export const profileRegistry: ProfileRegistry = [
  {
    type: "catalog",
    path: "https://fairspec.org/profiles/latest/catalog.json",
    version: "latest",
    profile: catalogProfile,
  },
  {
    type: "dataset",
    path: "https://fairspec.org/profiles/latest/dataset.json",
    version: "latest",
    profile: datasetProfile,
  },
  {
    type: "schema",
    path: "https://fairspec.org/profiles/latest/schema.json",
    version: "latest",
    profile: schemaProfile,
  },
  {
    type: "dialect",
    path: "https://fairspec.org/profiles/latest/dialect.json",
    version: "latest",
    profile: dialectProfile,
  },
]
