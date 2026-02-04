import { inferDialect } from "@fairspec/library"
import { Command } from "commander"
import { selectFile } from "../../helpers/file.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const inferDialectCommand = new Command()
  .name("infer")
  .description("Infer the dialect of a file")
  .configureHelp(helpConfiguration)

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

    const dialect = await session.task("Inferring dialect", async () => {
      const dialect = await inferDialect(
        { data: path },
        { sampleBytes: options.sampleBytes },
      )

      if (!dialect) {
        throw new Error("Could not infer dialect")
      }

      return dialect
    })

    session.renderDataResult(dialect)
  })
