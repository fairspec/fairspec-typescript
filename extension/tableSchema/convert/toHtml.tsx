import type { Column, TableSchema } from "@fairspec/metadata"
import { prettify } from "htmlfy"
import { renderToStaticMarkup } from "react-dom/server"

export function convertTableSchemaToHtml(
  schema: TableSchema,
  options?: { frontmatter?: boolean },
): string {
  let html = prettify(renderToStaticMarkup(<SchemaTable schema={schema} />))

  if (options?.frontmatter) {
    html = `---\ntitle: Table Schema\n---\n\n${html}`
  }

  return html
}

function SchemaTable(props: { schema: TableSchema }) {
  const { schema } = props

  return (
    <>
      {schema.primaryKey && <PrimaryKey fields={schema.primaryKey} />}
      {schema.foreignKeys && schema.foreignKeys.length > 0 && (
        <ForeignKeys foreignKeys={schema.foreignKeys} />
      )}
      <FieldsTable properties={schema.properties} required={schema.required} />
    </>
  )
}

function FieldsTable(props: {
  properties: Record<string, Column>
  required?: string[]
}) {
  const { properties, required } = props
  const columns = Object.entries(properties)

  return (
    <>
      <h2>Columns</h2>
      <table>
        <colgroup>
          <col width="20%" />
          <col width="65%" />
          <col width="15%" />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Definition</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {columns.map(([name, column]) => (
            <FieldRow
              key={name}
              name={name}
              column={column}
              isRequired={required?.includes(name) ?? false}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}

function FieldRow(props: {
  name: string
  column: Column
  isRequired: boolean
}) {
  const { name, column, isRequired } = props
  const columnType = column.type || "any"
  const columnDescription = column.description || ""

  const constraints = extractConstraints(column)

  return (
    <tr>
      <td id={sanitizeId(name)}>
        <code>
          <strong>
            {name}
            {!isRequired && "?"}
          </strong>
        </code>
      </td>
      <td>
        {columnDescription && <p>{columnDescription}</p>}
        {constraints.length > 0 && (
          <ConstraintsList constraints={constraints} />
        )}
        {(column.type === "string" || column.type === "integer") &&
          "categories" in column &&
          column.categories !== undefined && (
            <CategoriesList categories={column.categories} />
          )}
      </td>
      <td>
        <code>{columnType}</code>
      </td>
    </tr>
  )
}

function ConstraintsList(props: { constraints: Constraint[] }) {
  const { constraints } = props
  return (
    <>
      <strong>Constraints</strong>
      <ul>
        {constraints.map((constraint, index) => (
          <li key={index}>
            {constraint.name}: <code>{constraint.value}</code>
          </li>
        ))}
      </ul>
    </>
  )
}

function CategoriesList(props: { categories: any[] }) {
  const { categories } = props
  return (
    <>
      <strong>Categories</strong>
      <ul>
        {categories.map((category, index) => {
          const value = typeof category === "object" ? category.value : category
          const label =
            typeof category === "object" ? category.label : undefined
          return (
            <li key={index}>
              <code>{String(value)}</code>
              {label && ` - ${label}`}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function extractConstraints(column: Column): Constraint[] {
  const constraints: Constraint[] = []

  if ("minimum" in column && column.minimum !== undefined) {
    constraints.push({ name: "minimum", value: String(column.minimum) })
  }
  if ("maximum" in column && column.maximum !== undefined) {
    constraints.push({ name: "maximum", value: String(column.maximum) })
  }
  if ("minLength" in column && column.minLength !== undefined) {
    constraints.push({ name: "minLength", value: String(column.minLength) })
  }
  if ("maxLength" in column && column.maxLength !== undefined) {
    constraints.push({ name: "maxLength", value: String(column.maxLength) })
  }
  if ("pattern" in column && column.pattern) {
    constraints.push({ name: "pattern", value: column.pattern })
  }
  if ("enum" in column && column.enum) {
    const enumValues = column.enum.map((v: any) => String(v)).join(", ")
    constraints.push({ name: "enum", value: enumValues })
  }

  return constraints
}

function PrimaryKey(props: { fields: string[] }) {
  const { fields } = props
  return (
    <>
      <h2>Primary Key</h2>
      <p>
        <code>{fields.join(", ")}</code>
      </p>
    </>
  )
}

function ForeignKeys(props: { foreignKeys: TableSchema["foreignKeys"] }) {
  const { foreignKeys } = props
  if (!foreignKeys) return null

  return (
    <>
      <h2>Foreign Keys</h2>
      <table>
        <colgroup>
          <col width="40%" />
          <col width="30%" />
          <col width="30%" />
        </colgroup>
        <thead>
          <tr>
            <th>Columns</th>
            <th>Reference Resource</th>
            <th>Reference Columns</th>
          </tr>
        </thead>
        <tbody>
          {foreignKeys.map((fk, index) => (
            <tr key={index}>
              <td>
                <code>{fk.columns.join(", ")}</code>
              </td>
              <td>
                <code>{fk.reference.resource || "-"}</code>
              </td>
              <td>
                <code>{fk.reference.columns.join(", ")}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface Constraint {
  name: string
  value: string
}
