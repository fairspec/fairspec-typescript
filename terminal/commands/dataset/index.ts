import { Command } from "commander"
import { helpConfiguration } from "../../helpers/help.ts"
import { copyDatasetCommand } from "./copy.ts"
import { inferDatasetCommand } from "./infer.tsx"
import { scriptDatasetCommand } from "./script.tsx"
import { validateDatasetCommand } from "./validate.tsx"

export const datasetCommand = new Command("dataset")
  .configureHelp(helpConfiguration)
  .description("Dataset related commands")

  .addCommand(copyDatasetCommand)
  .addCommand(inferDatasetCommand)
  .addCommand(exploreDatasetCommand)
  .addCommand(publishDatasetCommand)
  .addCommand(scriptDatasetCommand)
  .addCommand(validateDatasetCommand)
