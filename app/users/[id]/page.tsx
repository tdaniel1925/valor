import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { users, userRoles, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewUsers = await checkPermission(authUser.id, "users", "read")
  if (!canViewUsers) {
    redirect("/users")
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1)

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
        <Link href="/users">
          <Button variant="outline" className="mt-4">Back to Users</Button>
        </Link>
      </div>
    )
  }

  const userRoleRecords = await db
    .select({
      roleId: roles.id,
      roleName: roles.name,
      roleDescription: roles.description,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : user.email}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Link href="/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{user.email}</dd>
              </div>
              {user.firstName && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                  <dd className="text-sm">{user.firstName}</dd>
                </div>
              )}
              {user.lastName && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                  <dd className="text-sm">{user.lastName}</dd>
                </div>
              )}
              {user.phone && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd className="text-sm">{user.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Assigned roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {userRoleRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned.</p>
            ) : (
              <div className="space-y-2">
                {userRoleRecords.map((role) => (
                  <div key={role.roleId} className="p-3 rounded-md border">
                    <p className="font-medium">{role.roleName}</p>
                    {role.roleDescription && (
                      <p className="text-sm text-muted-foreground">{role.roleDescription}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
