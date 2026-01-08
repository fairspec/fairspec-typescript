import { saveDescriptor } from "../descriptor/index.ts"
import { getBasepath } from "../path/index.ts"
import type { Dataset } from "./Dataset.ts"
import { denormalizeDataset } from "./denormalize.ts"

/**
 * Save a Dataset to a file path
 * Works in Node.js environments
 */
export async function saveDatasetDescriptor(
  dataset: Dataset,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const basepath = getBasepath(options.path)
  const descriptor = denormalizeDataset(dataset, { basepath })

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
