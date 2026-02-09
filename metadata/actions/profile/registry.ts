import type { ProfileRegistry } from "../../models/profile.ts"
import catalogProfile from "../../profiles/catalog.json" with { type: "json" }
import dataSchemaProfile from "../../profiles/data-schema.json" with {
  type: "json",
}
import datasetProfile from "../../profiles/dataset.json" with { type: "json" }
import fileDialectProfile from "../../profiles/file-dialect.json" with {
  type: "json",
}
import tableSchemaProfile from "../../profiles/table-schema.json" with {
  type: "json",
}

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
    type: "file-dialect",
    path: "https://fairspec.org/profiles/latest/dialect.json",
    version: "latest",
    profile: fileDialectProfile,
  },
  {
    type: "data-schema",
    path: "https://fairspec.org/profiles/latest/data-schema.json",
    version: "latest",
    profile: dataSchemaProfile,
  },
  {
    type: "table-schema",
    path: "https://fairspec.org/profiles/latest/table-schema.json",
    version: "latest",
    profile: tableSchemaProfile,
  },
]
