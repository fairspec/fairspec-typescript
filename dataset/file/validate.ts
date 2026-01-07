import type { FairspecError, Resource } from "@fairspec/metadata"
import { createReport } from "@fairspec/metadata"
import { inferHash } from "./infer.ts"

export async function validateFile(resource: Partial<Resource>) {
  const errors: FairspecError[] = []

  if (resource.integrity) {
    const expectedHash = resource.integrity.hash
    const actualHash = await inferHash(resource, {
      hashType: resource.integrity.type,
    })

    if (actualHash !== expectedHash) {
      errors.push({
        type: "file/integrity",
        expectedHash,
        actualHash,
      })
    }
  }

  return createReport(errors)
}
