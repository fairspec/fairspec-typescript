import type { Descriptor } from "../../models/descriptor.ts"
import type { Dialect } from "../../models/dialect/dialect.ts"
import { validateDialect } from "./validate.ts"

export async function assertDialect(source: Descriptor | Dialect) {
  const report = await validateDialect(source)

  if (!report.dialect) {
    throw new Error(
      `Dialect "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.dialect
}
