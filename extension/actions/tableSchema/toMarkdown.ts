import type { TableSchema } from "@fairspec/metadata"

export function convertTableSchemaToMarkdown(
  schema: TableSchema,
  options?: { frontmatter?: boolean },
): string {
  const rows: string[] = []

  rows.push("")
  rows.push("## Columns")
  rows.push("")
  rows.push("| Name | Type | Title | Description | Constraints |")
  rows.push("|------|------|-------|-------------|-------------|")

  const columns = Object.entries(schema.properties)
  const required = schema.required || []

  for (const [name, column] of columns) {
    const type = column.type || "any"
    const title = column.title || ""
    const description = column.description || ""

    const constraints: string[] = []

    if (required.includes(name)) {
      constraints.push("required")
    }

    if ("minimum" in column && column.minimum !== undefined) {
      constraints.push(`min: ${column.minimum}`)
    }
    if ("maximum" in column && column.maximum !== undefined) {
      constraints.push(`max: ${column.maximum}`)
    }
    if ("minLength" in column && column.minLength !== undefined) {
      constraints.push(`minLength: ${column.minLength}`)
    }
    if ("maxLength" in column && column.maxLength !== undefined) {
      constraints.push(`maxLength: ${column.maxLength}`)
    }
    if ("pattern" in column && column.pattern) {
      constraints.push(`pattern: ${column.pattern}`)
    }
    if ("enum" in column && column.enum) {
      constraints.push(`enum: ${column.enum.join(", ")}`)
    }

    const constraintsStr = constraints.join(", ")

    const escapedName = escapeMarkdown(name)
    const escapedTitle = escapeMarkdown(title)
    const escapedDescription = escapeMarkdown(description)
    const escapedConstraints = escapeMarkdown(constraintsStr)

    rows.push(
      `| ${escapedName} | ${type} | ${escapedTitle} | ${escapedDescription} | ${escapedConstraints} |`,
    )
  }

  let markdown = `${rows.join("\n")}\n`

  if (options?.frontmatter) {
    const header: string[] = []
    header.push("---")
    header.push("title: Table Schema")
    header.push("---")
    header.push("")
    markdown = header.join("\n") + markdown
  }

  return markdown
}

function escapeMarkdown(text: string): string {
  return text.replace(/\n/g, " ")
}
