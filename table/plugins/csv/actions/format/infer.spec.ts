import { writeTempFile } from "@fairspec/dataset"
import type { Resource } from "@fairspec/metadata"
import { describe, expect, it } from "vitest"
import { inferCsvFormat } from "./infer.ts"

describe("inferCsvFormat", () => {
  it("should infer a simple CSV file", async () => {
    const path = await writeTempFile("id,name\n1,english\n2,中文")
    const format = await inferCsvFormat({ data: path })

    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      lineTerminator: "\n",
    })
  })

  it("should infer quoteChar", async () => {
    const path = await writeTempFile('id,name\n1,"John Doe"\n2,"Jane Smith"')
    const format = await inferCsvFormat({ data: path })

    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      quoteChar: '"',
      lineTerminator: "\n",
    })
  })

  it("should infer quoteChar with single quotes", async () => {
    const path = await writeTempFile("id,name\n1,'John Doe'\n2,'Jane Smith'")
    const format = await inferCsvFormat({ data: path })

    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      quoteChar: "'",
      lineTerminator: "\n",
    })
  })

  // TODO: it gives false positives
  it.skip("should infer header false when no header present", async () => {
    const path = await writeTempFile("1,english\n2,中文\n3,español")
    const format = await inferCsvFormat({ data: path })

    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      headerRows: false,
    })
  })

  it("should not set header when header is present", async () => {
    const path = await writeTempFile("id,name\n1,english\n2,中文")
    const format = await inferCsvFormat({ data: path })

    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      lineTerminator: "\n",
    })
  })

  // TODO: recover if possible with csv-sniffer
  it.skip("should infer complex CSV with quotes and header", async () => {
    const path = await writeTempFile(
      'name,description\n"Product A","A great product with, commas"\n"Product B","Another product"',
    )

    const format = await inferCsvFormat({ data: path })
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      quoteChar: '"',
    })
  })

  it("should infer format from CSV file with comma delimiter", async () => {
    const path = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      lineTerminator: "\n",
    })
  })

  it("should infer format from CSV file with pipe delimiter", async () => {
    const path = await writeTempFile("id|name|age\n1|alice|25\n2|bob|30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: "|",
      lineTerminator: "\n",
    })
  })

  it("should infer format from CSV file with semicolon delimiter", async () => {
    const path = await writeTempFile("id;name;age\n1;alice;25\n2;bob;30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ";",
      lineTerminator: "\n",
    })
  })

  it("should infer format from TSV file with tab delimiter", async () => {
    const path = await writeTempFile("id\tname\tage\n1\talice\t25\n2\tbob\t30")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "tsv",
      lineTerminator: "\n",
    })
  })

  it("should handle CSV with quoted fields", async () => {
    const path = await writeTempFile(
      'id,name,description\n1,"alice","Description with, comma"\n2,"bob","Normal text"',
    )

    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      quoteChar: '"',
      lineTerminator: "\n",
    })
  })

  it("should handle CSV with different quote character", async () => {
    const path = await writeTempFile(
      "id,name,description\n1,'alice','Description text'\n2,'bob','Normal text'",
    )

    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      quoteChar: "'",
      lineTerminator: "\n",
    })
  })

  it("should handle resources without path", async () => {
    const resource: Resource = {
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const format = await inferCsvFormat(resource)
    expect(format).toBeUndefined()
  })

  it("should return empty object for non-CSV resources", async () => {
    const resource: Resource = {
      format: { type: "json" },
      data: [{ id: 1 }],
    }

    const format = await inferCsvFormat(resource)
    expect(format).toBeUndefined()
  })

  it("should handle CSV with custom line terminator", async () => {
    const path = await writeTempFile("id,name\r\n1,alice\r\n2,bob\r\n")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
      delimiter: ",",
      lineTerminator: "\r\n",
    })
  })

  it("should handle CSV with header row only", async () => {
    const path = await writeTempFile("id,name,age")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
    })
  })

  it("should handle empty CSV file", async () => {
    const path = await writeTempFile("")
    const resource: Resource = { data: path, format: { type: "csv" } }

    const format = await inferCsvFormat(resource)
    expect(format).toEqual({
      type: "csv",
    })
  })
})
