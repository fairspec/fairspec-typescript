import type { FileDialect } from "@fairspec/metadata"

export type DialectWithHeaderAndCommentRows = Extract<
  FileDialect,
  {
    headerRows?: any
    headerJoin?: any
    commentRows?: any
    commentPrefix?: any
    columnNames?: any
  }
>
