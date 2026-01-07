import { copyDescriptor } from "../descriptor/index.ts"
import { denormalizeJsonSchema } from "../jsonSchema/index.ts"
import { denormalizePath } from "../path/index.ts"
import type { Resource } from "../resource/index.ts"
import { denormalizeTableSchema } from "../tableSchema/index.ts"
import type { Dataset } from "./Dataset.ts"

export function denormalizeDataset(
  dataset: Dataset,
  options?: {
    basepath?: string
  },
) {
  dataset = copyDescriptor(dataset)

  dataset.resources?.forEach(resource => {
    denormalizeResourceData(resource, options)
    denormalizeResourceJsonSchema(resource, options)
    denormalizeResourceTableSchema(resource, options)
  })

  return dataset
}

function denormalizeResourceData(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  const basepath = options?.basepath

  if (typeof resource.data === "string") {
    resource.data = denormalizePath(resource.data, { basepath })
  }

  if (Array.isArray(resource.data)) {
    for (const [index, path] of resource.data.entries()) {
      if (typeof path === "string") {
        resource.data[index] = denormalizePath(path, { basepath })
      }
    }
  }
}

function denormalizeResourceJsonSchema(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  const basepath = options?.basepath

  if (typeof resource.jsonSchema === "string") {
    resource.jsonSchema = denormalizePath(resource.jsonSchema, { basepath })
  } else if (resource.jsonSchema) {
    resource.jsonSchema = denormalizeJsonSchema(resource.jsonSchema)
  }
}

function denormalizeResourceTableSchema(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  const basepath = options?.basepath

  if (typeof resource.tableSchema === "string") {
    resource.tableSchema = denormalizePath(resource.tableSchema, { basepath })
  } else if (resource.tableSchema) {
    resource.tableSchema = denormalizeTableSchema(resource.tableSchema)
  }
}
