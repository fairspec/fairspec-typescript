import type { Dialect } from "@fairspec/metadata"

export type DialectWithHeaderAndCommentRows = Extract<
  Dialect,
  {
    headerRows?: any
    headerJoin?: any
    commentRows?: any
    commentPrefix?: any
    columnNames?: any
  }
>
