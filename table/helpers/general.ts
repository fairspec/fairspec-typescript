export function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
