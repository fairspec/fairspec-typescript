import type { ProfileRegistry } from "../../models/profile.ts"
import catalog from "../../profiles/catalog.json" with { type: "json" }
import dataset from "../../profiles/dataset.json" with { type: "json" }
import table from "../../profiles/table.json" with { type: "json" }

export const profileRegistry: ProfileRegistry = [
  {
    type: "catalog",
    path: "https://fairspec.org/profiles/latest/catalog.json",
    version: "latest",
    profile: catalog,
  },
  {
    type: "dataset",
    path: "https://fairspec.org/profiles/latest/dataset.json",
    version: "latest",
    profile: dataset,
  },
  {
    type: "table",
    path: "https://fairspec.org/profiles/latest/table.json",
    version: "latest",
    profile: table,
  },
]
