import { validateFile } from "@fairspec/dataset"
import { Command } from "commander"
import pc from "picocolors"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const validateFileCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a file from a local or remote path")

  .addArgument(params.requiredPositionalFilePath)
  .addOption(params.hash)
  .addOption(params.hashType)
  .addOption(params.silent)
  .addOption(params.debug)

  .action(async (path, options) => {
    const session = new Session({
      silent: options.silent,
      debug: options.debug,
    })

    await session.task(pc.bold("Validate file"), async () => {
      const report = await validateFile({
        data: path,
        integrity: options.hash
          ? { hash: options.hash, type: options.hashType ?? "md5" }
          : undefined,
      })

      for (const error of report.errors) {
        console.log(error)
      }

      if (!report.valid) {
        throw new Error("File is not valid")
      }
    })
  })
