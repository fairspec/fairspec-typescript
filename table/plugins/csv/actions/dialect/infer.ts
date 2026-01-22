import { text } from "node:stream/consumers"
import { loadFileStream } from "@fairspec/dataset"
import type { CsvDialect, Resource, TsvDialect } from "@fairspec/metadata"
import { getDataPath } from "@fairspec/metadata"
import { default as CsvSnifferFactory } from "csv-sniffer"

const DELIMITERS = [",", ";", ":", "|", "\t", "^", "*", "&"]

export async function inferCsvDialect(
  resource: Resource,
  options?: {
    sampleBytes?: number
  },
) {
  const { sampleBytes = 10_000 } = options ?? {}

  const dataPath = getDataPath(resource)
  if (!dataPath) {
    return undefined
  }

  const stream = await loadFileStream(dataPath, {
    maxBytes: sampleBytes,
  })

  const sample = await text(stream)
  const result = sniffSample(sample, DELIMITERS)

  let dialect: CsvDialect | TsvDialect = { format: "csv" }

  if (result?.delimiter) {
    if (result.delimiter === "\t") {
      dialect = { format: "tsv" }
    } else {
      dialect.delimiter = result.delimiter
    }
  }

  if (dialect.format === "csv") {
    if (result?.quoteChar) {
      dialect.quoteChar = result.quoteChar
    }
  }

  if (result?.newlineStr) {
    dialect.lineTerminator = result.newlineStr
  }

  return dialect
}

function sniffSample(sample: string, delimiters: string[]) {
  try {
    const CsvSniffer = CsvSnifferFactory()
    const sniffer = new CsvSniffer(delimiters)
    const result = sniffer.sniff(sample)
    return result
  } catch {
    return undefined
  }
}
