import { writeTempFile } from "@fairspec/dataset"
import type { CsvDialect, Resource } from "@fairspec/metadata"
import { describe, expect, it } from "vitest"
import { inferDialect } from "./infer.ts"

describe("inferDialect", () => {
  it("should infer CSV format", async () => {
    const path = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")
    const resource: Resource = { data: path, dialect: { format: "csv" } }

    const dialect = await inferDialect(resource)
    expect(dialect).toEqual<CsvDialect>({
      format: "csv",
      delimiter: ",",
      headerRows: [1],
      lineTerminator: "\n",
    })
  })

  it("should infer TSV format", async () => {
    const path = await writeTempFile("id\tname\tage\n1\talice\t25\n2\tbob\t30")
    const resource: Resource = { data: path, dialect: { format: "csv" } }

    const dialect = await inferDialect(resource)
    expect(dialect).toEqual({
      format: "tsv",
      headerRows: [1],
      lineTerminator: "\n",
    })
  })

  it("should infer JSON format", async () => {
    const path = await writeTempFile(JSON.stringify([{ id: 1, name: "alice" }]))
    const resource: Resource = { data: path, dialect: { format: "json" } }

    const dialect = await inferDialect(resource)
    expect(dialect).toEqual({ format: "json" })
  })

  it("should return undefined for inline data", async () => {
    const resource: Resource = {
      data: [{ id: 1 }],
    }

    const dialect = await inferDialect(resource)
    expect(dialect).toBeUndefined()
  })
})
