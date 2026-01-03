import type { BaseError } from "./Base.ts"

/**
 * A descriptor error
 */
export interface MetadataError extends BaseError {
  type: "metadata"
  message: string
  jsonPointer: string
}
