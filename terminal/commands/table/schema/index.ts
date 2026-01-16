import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { convertTableSchemaCommand } from "./convert.tsx"
import { inferTableSchemaCommand } from "./infer.tsx"
import { validateTableSchemaCommand } from "./validate.tsx"

export const tableSchemaCommand = new Command("schema")
  .configureHelp(helpConfiguration)
  .description("Table Schema related commands")

  .addCommand(inferTableSchemaCommand)
  .addCommand(convertTableSchemaCommand)
  .addCommand(validateTableSchemaCommand)
