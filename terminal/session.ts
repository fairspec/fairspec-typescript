import type { TaskInnerAPI } from "tasuku"
import tasuku from "tasuku"

type TaskApi = Omit<TaskInnerAPI, "task">

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

  async task<T>(title: string, func: (api: TaskApi) => Promise<T>) {
    const runTask = async (api: TaskApi) => {
      try {
        return await func(api)
      } catch (error) {
        if (this.debug) {
          throw error
        }

        if (error instanceof Error) {
          api.setError(error)
        }

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
    return response.result
  }
}
