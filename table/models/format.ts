import type { Format } from "@fairspec/metadata"

export type FormatWithHeaderAndCommentRows = Extract<
  Format,
  {
    headerRows?: any
    headerJoin?: any
    commentRows?: any
    commentPrefix?: any
  }
>
