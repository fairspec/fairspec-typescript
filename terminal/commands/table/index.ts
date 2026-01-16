import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { describeTableCommand } from "./describe.tsx"
import { queryTableCommand } from "./query.tsx"
import { tableSchemaCommand } from "./schema/index.ts"
import { scriptTableCommand } from "./script.tsx"
import { validateTableCommand } from "./validate.tsx"

export const tableCommand = new Command("table")
  .configureHelp(helpConfiguration)
  .description("Table related commands")

  .addCommand(describeTableCommand)
  .addCommand(queryTableCommand)
  .addCommand(scriptTableCommand)
  .addCommand(validateTableCommand)
  .addCommand(tableSchemaCommand)
