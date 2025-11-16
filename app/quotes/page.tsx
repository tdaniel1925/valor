import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function QuotesPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  const canViewQuotes = await checkPermission(authUser.id, "quotes", "read")
  if (!canViewQuotes) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view quotes.
        </p>
      </div>
    )
  }

  // Get user's database record
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

  // Get all quotes for this user
  const allQuotes = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      type: quotes.type,
      carrier: quotes.carrier,
      product: quotes.product,
      createdAt: quotes.createdAt,
    })
    .from(quotes)
    .where(eq(quotes.agentId, dbUser.id))
    .orderBy(quotes.createdAt)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <Link href="/quotes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
        </Link>
      </div>

      {allQuotes.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground mb-4">No quotes yet.</p>
          <Link href="/quotes/new">
            <Button>Create Your First Quote</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Quote #</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Carrier</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allQuotes.map((quote) => (
                <tr key={quote.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{quote.quoteNumber || "—"}</td>
                  <td className="p-4 align-middle capitalize">{quote.type}</td>
                  <td className="p-4 align-middle">{quote.carrier || "—"}</td>
                  <td className="p-4 align-middle">{quote.product || "—"}</td>
                  <td className="p-4 align-middle">
                    {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4 align-middle">
                    <Link href={`/quotes/${quote.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
