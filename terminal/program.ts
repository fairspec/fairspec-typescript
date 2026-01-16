import tab from "@bomb.sh/tab/commander"
import * as commander from "commander"
// import { dataCommand } from "./commands/data/index.ts"
import { datasetCommand } from "./commands/dataset/index.ts"
import { fileCommand } from "./commands/file/index.ts"
// import { tableCommand } from "./commands/table/index.ts"
import { helpConfiguration } from "./helpers/help.ts"
import metadata from "./package.json" with { type: "json" }

export const program = commander.program
  .name("fairspec")
  .description(metadata.description)

  .version(metadata.version, "-v, --version")
  .configureHelp(helpConfiguration)

  .addCommand(datasetCommand)
  // .addCommand(tableCommand)
  // .addCommand(dataCommand)
  .addCommand(fileCommand)

// Add tab completion
// https://github.com/bombshell-dev/tab?tab=readme-ov-file#commanderjs-integration
tab(program)
