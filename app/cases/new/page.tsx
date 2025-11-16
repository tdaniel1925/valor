import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { CaseForm } from "@/components/cases/case-form"

export default async function NewCasePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canCreateCases = await checkPermission(user.id, "cases", "write")
  if (!canCreateCases) {
    redirect("/cases")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Case</h1>
      <CaseForm />
    </div>
  )
}

