import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { QuoteForm } from "@/components/quotes/quote-form"

export default async function NewQuotePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const canCreateQuotes = await checkPermission(user.id, "quotes", "write")
  if (!canCreateQuotes) {
    redirect("/quotes")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Quote</h1>
      <QuoteForm />
    </div>
  )
}
