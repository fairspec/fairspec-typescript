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

// TODO: Implement

export interface InferDialectOptions extends DialectOptions {
  sampleBytes?: number
}

export interface DialectOptions {
  delimiter?: string
}
