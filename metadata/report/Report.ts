import type { FairspecError } from "../error/index.ts"

export interface Report<T extends FairspecError = FairspecError> {
  valid: boolean
  errors: T[]
}
