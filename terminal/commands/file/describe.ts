import { describeFile } from "@fairspec/library"
import { Command } from "commander"
import pc from "picocolors"
import { selectFile } from "../../helpers/file.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const describeFileCommand = new Command("describe")
  .configureHelp(helpConfiguration)
  .description("Show stats for a local or remote file")

  .addArgument(params.positionalFilePath)
  .addOption(params.fromPackage)
  .addOption(params.fromResource)
  .addOption(params.hashType)
  .addOption(params.silent)
  .addOption(params.debug)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = new Session({
      silent: options.silent,
      debug: options.debug,
      json: options.json,
    })

    if (!path) {
      path = await selectFile(session, options)
    }

    await session.task(pc.bold("Describe file"), async () => {
      const stats = await describeFile(path, {
        hashType: options.hashType,
      })

      console.log(JSON.stringify(stats, null, 2))
    })
  })
