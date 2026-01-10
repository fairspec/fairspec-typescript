import type { Format } from "@fairspec/metadata"

export type FormatWithHeaderRows = Extract<
  Format,
  { headerRows?: any; headerJoin?: any }
>

export type FormatWithCommentRows = Extract<
  Format,
  { commentRows?: any; commentChar?: any }
>

// TODO: Implement

export interface InferDialectOptions extends DialectOptions {
  sampleBytes?: number
}

export interface DialectOptions {
  delimiter?: string
}
