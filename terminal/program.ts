import * as commander from "commander"
import { dataCommand } from "./commands/data/index.ts"
import { datasetCommand } from "./commands/dataset/index.ts"
import { fileCommand } from "./commands/file/index.ts"
import { tableCommand } from "./commands/table/index.ts"
import { helpConfiguration } from "./helpers/help.ts"
import metadata from "./package.json" with { type: "json" }

export const program = commander.program
  .name("dp")
  .description(
    "Fast data management CLI built on top of the Fairspec standard and Polars DataFrames",
  )

  .version(metadata.version, "-v, --version")
  .configureHelp(helpConfiguration)

  .addCommand(datasetCommand)
  .addCommand(tableCommand)
  .addCommand(dataCommand)
  .addCommand(fileCommand)

// TODO: Support tab completion when @bombsh/tab is released
//import tab from "@bombsh/tab/commander"
//tab(program)
