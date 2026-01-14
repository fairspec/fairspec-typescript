import { MysqlAdapter } from "./mysql.ts"
import { PostgresqlAdapter } from "./postgresql.ts"
import { SqliteAdapter } from "./sqlite.ts"

export function createDriver(name: string) {
  switch (name) {
    case "postgresql":
      return new PostgresqlAdapter()
    case "mysql":
      return new MysqlAdapter()
    case "sqlite":
      return new SqliteAdapter()
    default:
      throw new Error(`Unsupported database: "${name}"`)
  }
}
