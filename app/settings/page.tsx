import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { users, userRoles, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.supabaseAuthId, authUser.id))
    .limit(1)

  if (!dbUser) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    )
  }

  const userRoleRecords = await db
    .select({
      roleName: roles.name,
      roleDescription: roles.description,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, dbUser.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{dbUser.email}</dd>
              </div>
              {dbUser.firstName && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                  <dd className="text-sm">{dbUser.firstName}</dd>
                </div>
              )}
              {dbUser.lastName && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                  <dd className="text-sm">{dbUser.lastName}</dd>
                </div>
              )}
              {dbUser.phone && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd className="text-sm">{dbUser.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      dbUser.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {dbUser.isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Your assigned roles</CardDescription>
          </CardHeader>
          <CardContent>
            {userRoleRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned.</p>
            ) : (
              <div className="space-y-2">
                {userRoleRecords.map((role, idx) => (
                  <div key={idx} className="p-3 rounded-md border">
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

      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={dbUser} />
        </CardContent>
      </Card>
    </div>
  )
}
