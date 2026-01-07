import type { Descriptor } from "../descriptor/index.ts"
import { loadDescriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { validateTableSchema } from "../tableSchema/index.ts"
import type { Dataset } from "./Dataset.ts"
import { normalizeDataset } from "./normalize.ts"

export async function validateDatasetMetadata(
  source: Dataset | Descriptor | string,
  options?: {
    basepath?: string
  },
) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const report = await validateDescriptor(descriptor, {
    profileType: "dataset",
  })

  let dataset: Dataset | undefined
  if (report.valid) {
    // Valid -> we can cast it
    dataset = descriptor as Dataset
  }

  if (dataset) {
    dataset = normalizeDataset(dataset, {
      basepath: options?.basepath,
    })
  }

  if (dataset) {
    for (const [index, resource] of (dataset?.resources ?? []).entries()) {
      if (typeof resource.jsonSchema === "string") {
        // TODO: implement
      }

      if (typeof resource.tableSchema === "string") {
        const report = await validateTableSchema(resource.tableSchema, {
          rootJsonPointer: `/resources/${index}`,
        })

        report.errors.push(...report.errors)
      }
    }

    if (report.errors.length) {
      dataset = undefined
      report.valid = false
    }
  }

  return { ...report, dataset }
}
