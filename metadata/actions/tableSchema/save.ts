import { copyDescriptor } from "../../actions/descriptor/copy.ts"
import { saveDescriptor } from "../../actions/descriptor/save.ts"
import type { TableSchema } from "../../models/tableSchema.ts"
import * as settings from "../../settings.ts"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveTableSchema(
  tableSchema: TableSchema,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const descriptor = copyDescriptor(tableSchema)

  descriptor.$schema =
    descriptor.$schema ??
    `https://fairspec.org/profiles/${settings.FAIRSPEC_VERSION}/table.json`

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
