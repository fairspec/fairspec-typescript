import { loadDataset, saveDataset } from "@fairspec/library"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const copyDatasetCommand = new Command("copy")
  .configureHelp(helpConfiguration)
  .description("Copy a local or remote dataset to a local folder")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.toPathRequired)
  .addOption(params.silent)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = new Session({
      silent: options.silent,
      debug: options.debug,
    })

    await session.task(pc.bold("Copy dataset"), async () => {
      const dataset = await loadDataset(path)
      await saveDataset(dataset, { target: options.toPath })
    })

    session.renderTextResult(
      "success",
      `Copied dataset from ${pc.bold(path)} to ${pc.bold(options.toPath)}`,
    )
  })
