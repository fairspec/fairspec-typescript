import type { FairspecError } from "../../models/Error/Error.ts"
import type { Report } from "../../models/Report.ts"

export function createReport(
  errors?: FairspecError[],
  options?: { maxErrors?: number },
): Report {
  errors = (errors ?? []).slice(0, options?.maxErrors)
  const valid = errors.length === 0

  return { errors, valid }
}
