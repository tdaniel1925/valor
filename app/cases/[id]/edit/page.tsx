import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { cases, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { CaseForm } from "@/components/cases/case-form"

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canEditCases = await checkPermission(user.id, "cases", "write")
  if (!canEditCases) {
    redirect("/cases")
  }

  const [caseItem] = await db
    .select()
    .from(cases)
    .where(eq(cases.id, id))
    .limit(1)

  if (!caseItem) {
    redirect("/cases")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Case</h1>
      <CaseForm caseData={caseItem} />
    </div>
  )
}

