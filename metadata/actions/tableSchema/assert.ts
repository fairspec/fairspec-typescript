import type { Descriptor } from "../../models/descriptor.ts"
import type { TableSchema } from "../../models/tableSchema.ts"
import { validateTableSchema } from "./validate.ts"

/**
 * Assert a Table Schema descriptor (JSON Object) against its profile
 */
export async function assertTableSchema(source: Descriptor | TableSchema) {
  const report = await validateTableSchema(source)

  if (!report.tableSchema) {
    throw new Error(
      `Table Schema "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.tableSchema
}
