import { copyDescriptor } from "../../actions/descriptor/copy.ts"
import { saveDescriptor } from "../../actions/descriptor/save.ts"
import type { Dialect } from "../../models/dialect/dialect.ts"
import * as settings from "../../settings.ts"

export async function saveDialect(
  dialect: Dialect,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const descriptor = copyDescriptor(dialect)

  descriptor.$schema =
    descriptor.$schema ??
    `https://fairspec.org/profiles/${settings.FAIRSPEC_VERSION}/dialect.json`

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
