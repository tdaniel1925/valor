// Database query helper functions

import { eq, and, or, like, gte, lte, desc, asc, sql } from "drizzle-orm"
import type { SQL } from "drizzle-orm"

export interface FilterOptions {
  [key: string]: string | number | boolean | null | undefined
}

export interface SortOptions {
  field: string
  order: "asc" | "desc"
}

export interface PaginationOptions {
  page: number
  pageSize: number
}

/**
 * Builds WHERE conditions from filter options
 */
export function buildWhereConditions<T>(
  filters: FilterOptions,
  fieldMap: Record<string, (value: any) => SQL>
): SQL[] {
  const conditions: SQL[] = []

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === "") {
      continue
    }

    const conditionFn = fieldMap[key]
    if (conditionFn) {
      conditions.push(conditionFn(value))
    }
  }

  return conditions
}

/**
 * Builds ORDER BY clause from sort options
 */
export function buildOrderBy<T>(
  sort: SortOptions | undefined,
  fieldMap: Record<string, any>
): any {
  if (!sort || !fieldMap[sort.field]) {
    return []
  }

  const field = fieldMap[sort.field]
  return sort.order === "desc" ? [desc(field)] : [asc(field)]
}

/**
 * Calculates pagination offset
 */
export function getPaginationOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize
}

/**
 * Calculates total pages
 */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize)
}

/**
 * Common filter builders
 */
export const filterBuilders = {
  equals: (field: any) => (value: any) => eq(field, value),
  like: (field: any) => (value: string) => like(field, `%${value}%`),
  gte: (field: any) => (value: number | string) => {
    const val = typeof value === "string" ? new Date(value) : value
    return gte(field, val)
  },
  lte: (field: any) => (value: number | string) => {
    const val = typeof value === "string" ? new Date(value) : value
    return lte(field, val)
  },
  in: (field: any) => (values: any[]) => {
    if (values.length === 0) return sql`1 = 0` // Always false
    return sql`${field} = ANY(${values})`
  },
}

