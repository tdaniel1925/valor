import { db } from "@/db"
import { users, roles, permissions, userRoles, rolePermissions } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export type PermissionAction = "read" | "write" | "delete" | "admin"
export type PermissionResource = 
  | "dashboard"
  | "cases"
  | "quotes"
  | "contracts"
  | "commissions"
  | "reports"
  | "users"
  | "organizations"
  | "activity"

export async function getUserPermissions(userId: string): Promise<Set<string>> {
  const userWithRoles = await db
    .select({
      roleId: roles.id,
      roleName: roles.name,
      parentRoleId: roles.parentRoleId,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId))

  const roleIds = userWithRoles.map((r) => r.roleId)
  const parentRoleIds = userWithRoles
    .map((r) => r.parentRoleId)
    .filter((id): id is string => id !== null)

  // Get all role IDs including parent roles (for inheritance)
  const allRoleIds = [...new Set([...roleIds, ...parentRoleIds])]

  if (allRoleIds.length === 0) {
    return new Set()
  }

  // Get permissions for all roles
  const rolePerms = await db
    .select({
      resource: permissions.resource,
      action: permissions.action,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        // @ts-ignore - drizzle type issue
        rolePermissions.roleId.in(allRoleIds)
      )
    )

  // Create permission strings like "cases:read", "quotes:write"
  const permissionSet = new Set<string>()
  for (const perm of rolePerms) {
    permissionSet.add(`${perm.resource}:${perm.action}`)
  }

  return permissionSet
}

export function hasPermission(
  userPermissions: Set<string>,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  // Check for specific permission
  if (userPermissions.has(`${resource}:${action}`)) {
    return true
  }

  // Admin action grants all permissions for that resource
  if (userPermissions.has(`${resource}:admin`)) {
    return true
  }

  return false
}

export async function checkPermission(
  userId: string,
  resource: PermissionResource,
  action: PermissionAction
): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return hasPermission(permissions, resource, action)
}

