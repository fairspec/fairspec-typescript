import { validateFile } from "@fairspec/dataset"
// TODO: rebase on validateJsonValue
import { validateDocument } from "@fairspec/document"
import type { Descriptor, Resource } from "@fairspec/metadata"
import {
  createReport,
  loadDescriptor,
  resolveBasepath,
  validateResourceMetadata,
} from "@fairspec/metadata"
import type { InferSchemaOptions } from "@fairspec/table"
import { validateTable } from "../table/index.ts"

export async function validateResource(
  source: string | Descriptor | Partial<Resource>,
  options?: InferSchemaOptions & { basepath?: string },
) {
  let descriptor = source
  let basepath = options?.basepath

  if (typeof descriptor === "string") {
    basepath = await resolveBasepath(descriptor)
    descriptor = await loadDescriptor(descriptor)
  }

  const report = await validateResourceMetadata(descriptor, { basepath })

  if (!report.resource) {
    return report
  }

  return await validateResourceData(report.resource, options)
}

export async function validateResourceData(
  resource: Partial<Resource>,
  options?: InferSchemaOptions,
) {
  const fileReport = await validateFile(resource)
  if (!fileReport.valid) {
    return fileReport
  }

  const tableReport = await validateTable(resource, options)
  if (!tableReport.valid) {
    return tableReport
  }

  const documentReport = await validateDocument(resource)
  if (!documentReport.valid) {
    return documentReport
  }

  return createReport()
}
