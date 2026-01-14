import { text } from "node:stream/consumers"
import { loadFileStream } from "@fairspec/dataset"
import type { CsvFormat, Resource } from "@fairspec/metadata"
import { getPathData } from "@fairspec/metadata"
import { default as CsvSnifferFactory } from "csv-sniffer"

const DELIMITERS = [",", ";", ":", "|", "\t", "^", "*", "&"]

export async function inferCsvFormat(
  resource: Partial<Resource>,
  options?: {
    sampleBytes?: number
  },
) {
  const { sampleBytes = 10_000 } = options ?? {}

  const format: CsvFormat = {
    type: "csv",
  }

  const pathData = getPathData(resource)
  if (!pathData) {
    return format
  }

  const stream = await loadFileStream(pathData, {
    maxBytes: sampleBytes,
  })

  const sample = await text(stream)
  const result = sniffSample(sample, DELIMITERS)

  if (result?.delimiter) {
    format.delimiter = result.delimiter
  }

  if (result?.quoteChar) {
    format.quoteChar = result.quoteChar
  }

  return format
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
