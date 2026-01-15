import type { Dataset } from "../../models/dataset.ts"
import type { Descriptor } from "../../models/descriptor.ts"
import { validateDatasetDescriptor } from "./validate.ts"

/**
 * Assert a Dataset descriptor (JSON Object) against its profile
 */
export async function assertDataset(
  source: Descriptor | Dataset,
  options?: {
    basepath?: string
  },
) {
  const report = await validateDatasetDescriptor(source, options)

  if (!report.dataset) {
    throw new Error(
      `Dataset "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.dataset
}
