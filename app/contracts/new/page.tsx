import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { ContractForm } from "@/components/contracts/contract-form"

export default async function NewContractPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canCreateContracts = await checkPermission(user.id, "contracts", "write")
  if (!canCreateContracts) {
    redirect("/contracts")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Request New Contract</h1>
      <ContractForm />
    </div>
  )
}

