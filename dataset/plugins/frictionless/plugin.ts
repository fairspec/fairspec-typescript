import type { Dataset, Descriptor, TableSchema } from "@fairspec/metadata"
import {
  getBasepath,
  loadDescriptor,
  normalizeDataset,
} from "@fairspec/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { convertDatasetFromFrictionless } from "./actions/dataset/fromFrictionless.ts"
import { convertDatasetToFrictionless } from "./actions/dataset/toFrictionless.ts"
import { convertTableSchemaFromFrictionless } from "./actions/tableSchema/fromFrictionless.ts"
import { convertTableSchemaToFrictionless } from "./actions/tableSchema/toFrictionless.ts"
import { FrictionlessPackage } from "./models/package.ts"
import { FrictionlessSchema } from "./models/schema.ts"

export class FrictionlessPlugin implements DatasetPlugin {
  convertDatasetTo(dataset: Dataset, options: { format: string }) {
    if (options.format !== "frictionless") return undefined
    return convertDatasetToFrictionless(dataset)
  }

  convertDatasetFrom(descriptor: Descriptor, options: { format: string }) {
    if (options.format !== "frictionless") return undefined
    const frictionlessPackage = FrictionlessPackage.parse(descriptor)
    return convertDatasetFromFrictionless(frictionlessPackage)
  }

  convertTableSchemaTo(tableSchema: TableSchema, options: { format: string }) {
    if (options.format !== "frictionless") return undefined
    return convertTableSchemaToFrictionless(tableSchema)
  }

  convertTableSchemaFrom(descriptor: Descriptor, options: { format: string }) {
    if (options.format !== "frictionless") return undefined
    const frictionlessSchema = FrictionlessSchema.parse(descriptor)
    return convertTableSchemaFromFrictionless(frictionlessSchema)
  }

  async loadDataset(source: string) {
    const isFrictionless = getIsFrictionless(source)
    if (!isFrictionless) return undefined

    const descriptor = await loadDescriptor(source)
    const frictionlessPackage = FrictionlessPackage.parse(descriptor)

    const basepath = getBasepath(source)
    let dataset = convertDatasetFromFrictionless(frictionlessPackage)
    dataset = normalizeDataset(dataset, { basepath })

    return dataset
  }
}

function getIsFrictionless(path: string) {
  return path.endsWith("datapackage.json")
}
