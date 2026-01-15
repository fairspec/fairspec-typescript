import os from "node:os"
import type { Dataset, DatasetError, Descriptor } from "@fairspec/metadata"
import {
  createReport,
  loadDescriptor,
  resolveBasepath,
  validateDatasetMetadata,
} from "@fairspec/metadata"
import pAll from "p-all"
import { validateResource } from "../../actions/resource/validate.ts"
import { system } from "../../system.ts"
import { validateDatasetIntegrity } from "./integrity.ts"

export async function validateDataset(
  source: string | Descriptor | Partial<Dataset>,
  options?: { basepath?: string },
) {
  let descriptor: Descriptor | undefined
  let basepath = options?.basepath

  if (typeof source !== "string") {
    descriptor = source
  } else {
    for (const plugin of system.plugins) {
      const result = await plugin.loadDataset?.(source)
      if (result) {
        descriptor = result as unknown as Descriptor
        break
      }
    }

    if (!descriptor) {
      basepath = await resolveBasepath(source)
      descriptor = await loadDescriptor(source)
    }
  }

  const metadataReport = await validateDatasetMetadata(descriptor, {
    basepath,
  })

  if (!metadataReport.dataset) {
    return {
      valid: metadataReport.valid,
      errors: metadataReport.errors.map(error => ({
        ...error,
        resource: undefined,
      })),
    }
  }

  const dataReport = await validateDatasetData(metadataReport.dataset)
  const integrityReport = await validateDatasetIntegrity(metadataReport.dataset)

  const errors = [...dataReport.errors, ...integrityReport.errors]
  return createReport(errors)
}

export async function validateDatasetData(dataset: Dataset) {
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
