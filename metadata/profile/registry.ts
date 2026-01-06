import catalog from "./assets/catalog.json" with { type: "json" }
import dataset from "./assets/dataset.json" with { type: "json" }
import table from "./assets/table.json" with { type: "json" }
import type { ProfileRegistry } from "./Profile.ts"

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
