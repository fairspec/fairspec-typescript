import { text } from "node:stream/consumers"
import { loadFileStream } from "@fairspec/dataset"
import type { CsvFormat, Resource, TsvFormat } from "@fairspec/metadata"
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

  const pathData = getPathData(resource)
  if (!pathData) {
    return undefined
  }

  const stream = await loadFileStream(pathData, {
    maxBytes: sampleBytes,
  })

  const sample = await text(stream)
  const result = sniffSample(sample, DELIMITERS)

  let format: CsvFormat | TsvFormat = { type: "csv" }

  if (result?.delimiter) {
    if (result.delimiter === "\t") {
      format = { type: "tsv" }
    } else {
      format.delimiter = result.delimiter
    }
  }

  if (format.type === "csv") {
    if (result?.quoteChar) {
      format.quoteChar = result.quoteChar
    }
  }

  if (result?.newlineStr) {
    format.lineTerminator = result.newlineStr
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
