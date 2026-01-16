import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"

export const dataCommand = new Command("data")
  .configureHelp(helpConfiguration)
  .description("Data related commands (JSON)")
