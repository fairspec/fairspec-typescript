import type { FairspecError } from "../error/index.ts"
import type { Report } from "./Report.ts"

export function createReport(
  errors?: FairspecError[],
  options?: { maxErrors?: number },
): Report {
  errors = (errors ?? []).slice(0, options?.maxErrors)
  const valid = errors.length === 0

  return { errors, valid }
}
