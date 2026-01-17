import os from "node:os"
import type { Dataset, DatasetError } from "@fairspec/metadata"
import { createReport } from "@fairspec/metadata"
import pAll from "p-all"
import { validateResource } from "../../actions/resource/validate.ts"
import { validateDatasetIntegrity } from "./integrity.ts"

export async function validateDataset(dataset: Dataset) {
  // TODO: parallelize?
  const resourcesReport = await validateDatasetResources(dataset)
  const integrityReport = await validateDatasetIntegrity(dataset)

  const errors = [...resourcesReport.errors, ...integrityReport.errors]
  return createReport(errors)
}

export async function validateDatasetResources(dataset: Dataset) {
  const concurrency = os.cpus().length

  const errors: DatasetError[] = (
    await pAll(
      (dataset.resources ?? []).map((resource, index) => async () => {
        const resourceName = resource.name ?? `resource${index + 1}`

        try {
          const report = await validateResource(resource)
          return report.errors.map(error => ({
            ...error,
            resource: resourceName,
          }))
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          throw new Error(`[${resource.name}] ${message}`)
        }
      }),
      { concurrency },
    )
  ).flat()

  return createReport(errors)
}
