import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { UserForm } from "@/components/users/user-form"

export default async function NewUserPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canCreateUsers = await checkPermission(authUser.id, "users", "write")
  if (!canCreateUsers) {
    redirect("/users")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New User</h1>
      <UserForm />
    </div>
  )
}

