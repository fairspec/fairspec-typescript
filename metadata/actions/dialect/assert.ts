import type { Descriptor } from "../../models/descriptor.ts"
import type { Dialect } from "../../models/dialect/dialect.ts"
import { FairspecException } from "../../models/exception.ts"
import { validateDialect } from "./validate.ts"

export async function assertDialect(source: Descriptor | Dialect) {
  const report = await validateDialect(source)

  if (!report.dialect) {
    throw new FairspecException(`Invalid dialect`, { report })
  }

  return report.dialect
}
