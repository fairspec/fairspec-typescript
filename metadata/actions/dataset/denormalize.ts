import { copyDescriptor } from "../descriptor/index.ts"
import { denormalizeResource } from "../resource/index.ts"
import type { Dataset } from "./Dataset.ts"

export function denormalizeDataset(
  dataset: Dataset,
  options: {
    basepath?: string
  },
) {
  dataset = copyDescriptor(dataset)

  dataset.resources = dataset.resources?.map(resource =>
    denormalizeResource(resource, options),
  )

  return dataset
}
