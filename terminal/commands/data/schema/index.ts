import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { inferDataSchemaCommand } from "./infer.ts"
import { validateDataSchemaCommand } from "./validate.ts"

export const dataSchemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Data Schema related commands")

  .addCommand(inferDataSchemaCommand)
  .addCommand(validateDataSchemaCommand)
