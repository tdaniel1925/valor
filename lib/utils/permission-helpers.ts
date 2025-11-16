// Permission checking utility functions

import { getUserPermissions } from "@/lib/permissions"
import { User } from "@/lib/types"

/**
 * Checks if user has a specific permission
 */
export async function hasPermission(
  user: User | null,
  resource: string,
  action: string
): Promise<boolean> {
  if (!user) return false

  const permissions = await getUserPermissions(user.id)
  // Check for specific permission in the Set (format: "resource:action")
  return permissions.has(`${resource}:${action}`) || permissions.has(`${resource}:admin`)
}

/**
 * Checks if user has any of the specified permissions
 */
export async function hasAnyPermission(
  user: User | null,
  checks: Array<{ resource: string; action: string }>
): Promise<boolean> {
  if (!user) return false

  for (const check of checks) {
    if (await hasPermission(user, check.resource, check.action)) {
      return true
    }
  }
  return false
}

/**
 * Checks if user has all of the specified permissions
 */
export async function hasAllPermissions(
  user: User | null,
  checks: Array<{ resource: string; action: string }>
): Promise<boolean> {
  if (!user) return false

  for (const check of checks) {
    if (!(await hasPermission(user, check.resource, check.action))) {
      return false
    }
  }
  return true
}

/**
 * Gets user's role name
 */
export function getUserRole(user: User | null): string | null {
  // This would typically come from a join query
  // For now, return null as a placeholder
  return null
}

/**
 * Checks if user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  const role = getUserRole(user)
  return role === roleName
}

