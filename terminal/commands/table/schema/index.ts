import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { convertTableSchemaCommand } from "./convert.ts"
import { inferTableSchemaCommand } from "./infer.ts"
import { validateTableSchemaCommand } from "./validate.ts"

export const tableSchemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(inferTableSchemaCommand)
  .addCommand(convertTableSchemaCommand)
  .addCommand(validateTableSchemaCommand)
