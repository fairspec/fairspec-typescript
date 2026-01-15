import { writeTempFile } from "@fairspec/dataset"
import type { Resource } from "@fairspec/metadata"
import { describe, expect, it } from "vitest"
import { inferFormat } from "./infer.ts"

describe("inferFormat", () => {
  it("should infer CSV format", async () => {
    const path = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      lineTerminator: "\n",
    })
  })

  it("should infer TSV format", async () => {
    const path = await writeTempFile("id\tname\tage\n1\talice\t25\n2\tbob\t30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferFormat(resource)
    expect(format).toEqual({
      type: "tsv",
      lineTerminator: "\n",
    })
  })

  it("should infer no format for inline data", async () => {
    const resource: Resource = {
      format: { type: "json" },
      data: [{ id: 1 }],
    }

    const format = await inferFormat(resource)
    expect(format).toBeUndefined()
  })
})
