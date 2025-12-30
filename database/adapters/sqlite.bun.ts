import { BunSqliteDialect } from "kysely-bun-sqlite"

export async function createBunSqliteDialect(path: string) {
  // @ts-expect-error
  const { Database } = await import("bun:sqlite")
  return new BunSqliteDialect({ database: new Database(path) })
}
