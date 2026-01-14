import { MysqlDriver } from "./mysql.ts"
import { PostgresqlDriver } from "./postgresql.ts"
import { SqliteDriver } from "./sqlite.ts"

export function createDriver(name: string) {
  switch (name) {
    case "postgresql":
      return new PostgresqlDriver()
    case "mysql":
      return new MysqlDriver()
    case "sqlite":
      return new SqliteDriver()
    default:
      throw new Error(`Unsupported database: "${name}"`)
  }
}
