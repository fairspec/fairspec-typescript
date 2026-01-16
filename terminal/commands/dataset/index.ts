import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyDatasetCommand } from "./copy.ts"
import { inferDatasetCommand } from "./infer.ts"
import { listDatasetCommand } from "./list.ts"
import { scriptDatasetCommand } from "./script.ts"
import { validateDatasetCommand } from "./validate.ts"

export const datasetCommand = new Command("dataset")
  .configureHelp(helpConfiguration)
  .description("Dataset related commands")

  .addCommand(listDatasetCommand)
  .addCommand(copyDatasetCommand)
  .addCommand(inferDatasetCommand)
  .addCommand(scriptDatasetCommand)
  .addCommand(validateDatasetCommand)
