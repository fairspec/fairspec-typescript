import type { Dataset, DatasetError } from "@fairspec/metadata"
import { createReport, resolveTableSchema } from "@fairspec/metadata"
import type { Table } from "@fairspec/table"
import { loadTable } from "../../actions/table/load.ts"

// TODO: foreign key columns definition should be validated as well (metadata/here?)
// TODO: review temporary files creation from validateDataset call

export async function validateDatasetIntegrity(
  dataset: Dataset,
  options?: { maxErrors?: number },
) {
  const { maxErrors = 1000 } = options ?? {}

  const errors: DatasetError[] = []
  const tables: Record<string, Table> = {}

  for (const [index, resource] of (dataset.resources ?? []).entries()) {
    const resourceName = resource.name ?? `resource${index + 1}`

    const tableSchema = await resolveTableSchema(resource.tableSchema)
    if (!tableSchema) continue

    const foreignKeys = tableSchema.foreignKeys
    if (!foreignKeys) continue

    const names = [
      resource.name,
      ...foreignKeys.map(it => it.reference.resource),
    ].filter(Boolean) as string[]

    for (const name of names) {
      const resource = dataset.resources?.find(res => res.name === name)

      if (!resource) {
        errors.push({
          type: "resource/missing",
          resourceName: name,
          resource: resourceName,
        })

        continue
      }

      if (!tables[name]) {
        const table = await loadTable(resource)

        if (!table) {
          errors.push({
            type: "resource/type",
            expectedResourceType: "table",
            resource: resourceName,
          })

          continue
        }

        tables[name] = table
      }
    }

    for (const foreignKey of foreignKeys) {
      const left = tables[resourceName] as Table
      const right = tables[
        foreignKey.reference.resource ?? resourceName
      ] as Table

      const foreignKeyCheckTable = left
        .select(...foreignKey.columns)
        .join(right, {
          how: "anti",
          leftOn: foreignKey.columns,
          rightOn: foreignKey.reference.columns,
        })

      const foreignKeyCheckFrame = await foreignKeyCheckTable
        .head(maxErrors)
        .collect()

      for (const row of foreignKeyCheckFrame.toRecords() as any[]) {
        errors.push({
          type: "foreignKey",
          foreignKey,
          cells: Object.values(row).map(String),
          resource: resourceName,
        })
      }
    }
  }

  return createReport(errors, { maxErrors })
}
