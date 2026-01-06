import type { Descriptor } from "../descriptor/index.ts"
import type { Dataset } from "./Dataset.ts"
import { validateDatasetMetadata } from "./validate.ts"

/**
 * Assert a Dataset descriptor (JSON Object) against its profile
 */
export async function assertDataset(
  source: Descriptor | Dataset,
  options?: {
    basepath?: string
  },
) {
  const report = await validateDatasetMetadata(source, options)

  if (!report.dataset) {
    throw new Error(
      `Dataset "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.dataset
}
