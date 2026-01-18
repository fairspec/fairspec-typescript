import { inferFormat } from "@fairspec/library"
import { Command } from "commander"
import { selectFile } from "../../helpers/file.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const inferFormatCommand = new Command("infer")
  .configureHelp(helpConfiguration)
  .description("Infer the format of a file")

  .addArgument(params.positionalFilePath)
  .addOption(params.fromDataset)
  .addOption(params.fromResource)
  .addOption(params.sampleBytes)
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

    const format = await session.task("Inferring format", async () => {
      const format = await inferFormat(
        { data: path },
        { sampleBytes: options.sampleBytes },
      )

      if (!format) {
        throw new Error("Could not infer format")
      }

      return format
    })

    session.renderDataResult(format)
  })
