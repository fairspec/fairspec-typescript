import { validateTableSchema } from "@fairspec/library"
import { Command } from "commander"
import { omit } from "es-toolkit"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { Session } from "../../session.ts"

export const validateTableSchemaCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a Table Schema")

  .addArgument(params.requiredPositionalFilePath)
  .addOption(params.silent)
  .addOption(params.debug)
  .addOption(params.json)

  .action(async (path, options) => {
    const session = new Session({
      silent: options.silent,
      debug: options.debug,
      json: options.json,
    })

    const report = await session.task("Validating table schema", async () => {
      return await validateTableSchema(path)
    })

    session.renderDataResult(omit(report, ["tableSchema"]))
  })
