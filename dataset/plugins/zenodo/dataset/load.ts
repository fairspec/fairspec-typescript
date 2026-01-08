import { mergeDatasets } from "../../../dataset/index.ts"
import { makeZenodoApiRequest } from "../platform/index.ts"
import type { ZenodoDataset } from "./Dataset.ts"
import { convertDatasetFromZenodo } from "./convert/fromZenodo.ts"

export async function loadDatasetFromZenodo(
  datasetUrl: string,
  options?: {
    apiKey?: string
  },
) {
  const { apiKey } = options ?? {}
  const sandbox = new URL(datasetUrl).host === "sandbox.zenodo.org"

  const recordId = extractRecordId(datasetUrl)
  if (!recordId) {
    throw new Error(`Failed to extract record ID from URL: ${datasetUrl}`)
  }

  const zenodoDataset = await makeZenodoApiRequest<ZenodoDataset>({
    endpoint: `/records/${recordId}`,
    apiKey,
    sandbox,
  })

  const systemDataset = convertDatasetFromZenodo(zenodoDataset)
  const userDatasetPath = (systemDataset.resources ?? [])
    .filter(resource => resource.unstable_customMetadata?.zenodoKey === "dataset.json")
    .map(resource => resource.unstable_customMetadata?.zenodoUrl as string)
    .at(0)

  const dataset = await mergeDatasets({ systemDataset, userDatasetPath })
  dataset.resources?.forEach(resource => {
    delete resource.unstable_customMetadata
  })

  return dataset
}

function extractRecordId(datasetUrl: string): string | undefined {
  const url = new URL(datasetUrl)
  const pathParts = url.pathname.split("/").filter(Boolean)
  return pathParts.at(-1)
}
