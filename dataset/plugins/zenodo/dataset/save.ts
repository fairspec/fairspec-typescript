import { blob } from "node:stream/consumers"
import type { Dataset, Descriptor } from "@fairspec/metadata"
import { denormalizeDataset, stringifyDescriptor } from "@fairspec/metadata"
import { getDatasetBasepath } from "../../../dataset/index.ts"
import { saveResourceFiles } from "../../../resource/index.ts"
import { loadFileStream } from "../../../stream/index.ts"
import { makeZenodoApiRequest } from "../platform/index.ts"
import { convertDatasetToZenodo } from "./convert/toZenodo.ts"
import type { ZenodoDataset } from "./Dataset.ts"

export async function saveDatasetToZenodo(
  dataset: Dataset,
  options: {
    sandbox?: boolean
    apiKey: string
  },
) {
  const { apiKey, sandbox = false } = options
  const basepath = getDatasetBasepath(dataset)

  const newZenodoDataset = convertDatasetToZenodo(dataset)
  const zenodoDataset = (await makeZenodoApiRequest({
    payload: newZenodoDataset,
    endpoint: "/deposit/depositions",
    method: "POST",
    apiKey,
    sandbox,
  })) as ZenodoDataset

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataset.resources ?? []) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote: false,
        withoutFolders: true,
        saveFile: async options => {
          const upload = {
            name: options.denormalizedPath,
            data: await blob(await loadFileStream(options.normalizedPath)),
          }

          await makeZenodoApiRequest({
            endpoint: `/deposit/depositions/${zenodoDataset.id}/files`,
            method: "POST",
            upload,
            apiKey,
            sandbox,
          })

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizeDataset(dataset, { basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["dataset.json"]) {
    const upload = {
      name: denormalizedPath,
      data: new Blob([stringifyDescriptor(descriptor)]),
    }

    await makeZenodoApiRequest({
      endpoint: `/deposit/depositions/${zenodoDataset.id}/files`,
      method: "POST",
      upload,
      apiKey,
      sandbox,
    })
  }

  const url = new URL(zenodoDataset.links.html)
  return {
    path: `${url.origin}/records/${zenodoDataset.id}/files/dataset.json`,
    datasetUrl: `${url.origin}/uploads/${zenodoDataset.id}`,
  }
}
