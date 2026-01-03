import type { BaseError } from "./Base.ts"

export interface JsonError extends BaseError {
  type: "json"
  message: string
  jsonPointer: string
}
