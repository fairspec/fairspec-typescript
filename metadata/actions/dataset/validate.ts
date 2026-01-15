import { loadDescriptor } from "../../actions/descriptor/load.ts"
import { validateDescriptor } from "../../actions/descriptor/validate.ts"
import { loadProfile } from "../../actions/profile/load.ts"
import { validateTableSchema } from "../../actions/tableSchema/validate.ts"
import type { Dataset } from "../../models/dataset.ts"
import type { Descriptor } from "../../models/descriptor.ts"
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

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : `https://fairspec.org/profiles/latest/dataset.json`

  const profile = await loadProfile($schema, {
    profileType: "dataset",
  })

  const report = await validateDescriptor(descriptor, {
    profile,
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
      if (typeof resource.dataSchema === "string") {
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
