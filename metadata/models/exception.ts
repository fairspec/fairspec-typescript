import type { Report } from "./report.ts"

export class FairspecException extends Error {
  report?: Report

  constructor(message: string, report?: Report) {
    super(message)
    this.report = report
  }
}
