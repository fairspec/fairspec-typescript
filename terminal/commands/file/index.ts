import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyFileCommand } from "./copy.ts"
import { describeFileCommand } from "./describe.ts"
import { fileFormatCommand } from "./format/index.ts"
import { validateFileCommand } from "./validate.ts"

export const fileCommand = new Command("file")
  .configureHelp(helpConfiguration)
  .description("File related commands")

  .addCommand(copyFileCommand)
  .addCommand(describeFileCommand)
  .addCommand(validateFileCommand)
  .addCommand(fileFormatCommand)
