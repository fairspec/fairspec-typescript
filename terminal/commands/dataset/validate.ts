import { validatePackage } from "@dpkit/library"
import { Command } from "commander"
import React from "react"
import { Report } from "../../components/Report/index.ts"
import { selectErrorResource, selectErrorType } from "../../helpers/error.ts"
import { helpConfiguration } from "../../helpers/help.ts"
import * as params from "../../params/index.ts"
import { createSession, Session } from "../../session.ts"

export const validateDatasetCommand = new Command("validate")
  .configureHelp(helpConfiguration)
  .description("Validate a data package from a local or remote path")

  .addArgument(params.positionalDescriptorPath)
  .addOption(params.json)
  .addOption(params.debug)
  .addOption(params.quit)
  .addOption(params.all)

  .action(async (path, options) => {
    const session = createSession({
      title: "Validate package",
      json: options.json,
      debug: options.debug,
      quit: options.quit,
      all: options.all,
    })

    const report = await session.task(
      "Validating package",
      validatePackage(path),
    )

    if (report.errors.length) {
      // @ts-expect-error
      const name = await selectErrorResource(session, report.errors)
      // @ts-expect-error
      if (name) report.errors = report.errors.filter(e => e.resource === name)

      // @ts-expect-error
      const type = await selectErrorType(session, report.errors)
      // @ts-expect-error
      if (type) report.errors = report.errors.filter(e => e.type === type)
    }

    if (report.valid) {
      session.success("Package is valid")
      return
    }

    session.render(
      report,
      // @ts-expect-error
      <Report errors={report.errors} quit={options.quit} />,
    )
  })
