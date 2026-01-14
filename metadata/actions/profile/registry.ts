import type { ProfileRegistry } from "../../models/profile.ts"
import catalogProfile from "../../profiles/catalog.json" with { type: "json" }
import datasetProfile from "../../profiles/dataset.json" with { type: "json" }
import tableProfile from "../../profiles/table.json" with { type: "json" }

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
    type: "table",
    path: "https://fairspec.org/profiles/latest/table.json",
    version: "latest",
    profile: tableProfile,
  },
]
