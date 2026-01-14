import { MysqlDriver } from "./mysql.ts"
import { PostgresqlDriver } from "./postgresql.ts"
import { SqliteDriver } from "./sqlite.ts"

export function createDriver(protocol: string) {
  switch (protocol) {
    case "postgresql":
      return new PostgresqlDriver()
    case "mysql":
      return new MysqlDriver()
    case "sqlite":
      return new SqliteDriver()
    default:
      throw new Error(`Unsupported database protocol: "${protocol}"`)
  }
}
