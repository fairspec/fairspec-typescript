import { setTimeout } from "node:timers/promises"
import util from "node:util"
import type { Frame } from "@fairspec/library"
import { colorize } from "json-colorizer"
import pc from "picocolors"
import type { TaskInnerAPI } from "tasuku"
import tasuku from "tasuku"

type TaskApi = Omit<TaskInnerAPI, "task">
type Status = "success" | "warning" | "error"

export interface SessionOptions {
  silent?: boolean
  debug?: boolean
  json?: boolean
}

export class Session implements SessionOptions {
  silent?: boolean
  debug?: boolean
  json?: boolean

  constructor(options: SessionOptions) {
    this.silent = options.silent
    this.debug = options.debug
    this.json = options.json
  }

  renderText(status: Status, text: string) {
    if (this.silent || this.json) {
      return
    }

    console.log(renderStatus(status), text)
  }

  renderTextResult(status: Status, text: string) {
    if (this.silent) {
      return
    }

    if (this.json) {
      text = util.stripVTControlCharacters(text)
      console.log(JSON.stringify({ result: text }, null, 2))
      return
    }

    console.log(renderStatus(status), text)
  }

  renderDataResult(data: string | object) {
    if (this.silent) {
      return
    }

    if (this.json) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    console.log(colorize(data))
  }

  renderTableResult(frame: Frame) {
    console.log(frame)
    // TODO: implement
  }

  async task<T>(title: string, func: (api: TaskApi) => Promise<T>) {
    const runTask = async (api: TaskApi): Promise<T> => {
      try {
        return await func(api)
      } catch (error) {
        if (this.debug) {
          throw error
        }

        // TODO: Find a better way to terminate the process
        api.setError(error instanceof Error ? error : String(error))
        await setTimeout(100)
        process.exit(1)
      }
    }

    if (this.json || this.silent) {
      return await runTask({
        setTitle: () => {},
        setStatus: () => {},
        setOutput: () => {},
        setWarning: () => {},
        setError: error => {
          if (this.json) {
            console.log(JSON.stringify({ error: String(error) }, null, 2))
          }

          process.exit(1)
        },
      })
    }

    const response = await tasuku(title, runTask)
    if (response.state === "success") response.clear()
    return response.result
  }
}

// For some reason, biome replaces inline emojis
function renderStatus(status: Status) {
  switch (status) {
    case "success":
      return pc.green("\u2714")
    case "warning":
      return pc.yellow("\u26A0")
    case "error":
      return pc.red("\u00D7")
  }
}
