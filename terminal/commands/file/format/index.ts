import { Command } from "commander"
import { helpConfiguration } from "../../../helpers/help.ts"
import { inferFileFormatCommand } from "./infer.ts"

export const fileFormatCommand = new Command("format")
  .configureHelp(helpConfiguration)
  .description("File format related commands")

  .addCommand(inferFileFormatCommand)
