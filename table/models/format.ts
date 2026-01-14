import type { Format } from "@fairspec/metadata"

export type FormatWithHeaderAndCommentRows = Extract<
  Format,
  {
    headerRows?: any
    headerJoin?: any
    commentRows?: any
    commentChar?: any
  }
>

export interface FormatOptions {
  delimiter?: string
}

export interface InferFormatOptions extends FormatOptions {
  sampleBytes?: number
}
