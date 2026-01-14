import type { SaveDatasetOptions } from "@fairspec/dataset"
import type { Dataset } from "@fairspec/metadata"
import { isRemoteResource, resolveTableSchema } from "@fairspec/metadata"
import type { TablePlugin } from "@fairspec/table"
import { saveDatabaseTable } from "../../actions/table/save.ts"
import type { DatabaseProtocol } from "../../models/protocol.ts"

export async function saveDatasetToDatabase(
  dataset: Dataset,
  options: SaveDatasetOptions & {
    protocol: DatabaseProtocol
    plugins?: TablePlugin[]
  },
) {
  for (const resource of dataset.resources ?? []) {
    for (const plugin of options.plugins ?? []) {
      const isRemote = isRemoteResource(resource)
      if (isRemote && !options.withRemote) {
        continue
      }

      const table = await plugin.loadTable?.(resource)

      if (table) {
        const tableSchema = await resolveTableSchema(resource.tableSchema)

        // TODO: support parallel saving?
        await saveDatabaseTable(table, {
          path: options.target,
          format: { type: "sqlite", tableName: resource.name },
          tableSchema,
        })

        break
      }
    }
  }

  return { path: options.target }
}
