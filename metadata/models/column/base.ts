import { z } from "zod"

export function NullableType<T extends string>(literal: T) {
  return z.union([
    z.literal(literal),
    z.tuple([z.literal(literal), z.literal("null")]),
    z.tuple([z.literal("null"), z.literal(literal)]),
  ])
}

export function getBaseType(type: string | readonly string[]) {
  if (typeof type === "string") return type
  return type.find(t => t !== "null") ?? "null"
}

export function isNullableType(type: string | readonly string[]) {
  return Array.isArray(type)
}

export const BaseColumnProperty = z.object({
  title: z
    .string()
    .optional()
    .describe("An optional human-readable title for the column"),

  description: z
    .string()
    .optional()
    .describe("An optional detailed description of the column"),

  rdfType: z
    .string()
    .optional()
    .describe("An optional URI for semantic type (RDF)"),

  default: z.unknown().optional(),
})

export const BaseColumn = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  nullable: z.boolean().optional(),
  property: BaseColumnProperty,
})

export type BaseColumn = z.infer<typeof BaseColumn>
