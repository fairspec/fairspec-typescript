import type { FairspecError } from "../error/index.ts"

export function createReport<T = FairspecError>(
  errors?: T[],
  options?: { maxErrors?: number },
) {
  errors = (errors ?? []).slice(0, options?.maxErrors)
  const valid = errors.length === 0

  return { errors, valid }
}
