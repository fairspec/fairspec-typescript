import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { dataSchemaCommand } from "./schema/index.ts"
import { validateDataCommand } from "./validate.ts"

export const dataCommand = new Command("data")
  .configureHelp(helpConfiguration)
  .description("Data related commands")

  .addCommand(validateDataCommand)
  .addCommand(dataSchemaCommand)
