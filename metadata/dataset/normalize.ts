import { copyDescriptor } from "../descriptor/index.ts"
import { normalizeResource } from "../resource/index.ts"
import type { Dataset } from "./Dataset.ts"

export function normalizeDataset(
  dataset: Dataset,
  options: {
    basepath?: string
  },
) {
  dataset = copyDescriptor(dataset)

  dataset.resources = dataset.resources?.map(resource =>
    normalizeResource(resource, options),
  )

  return dataset
}
