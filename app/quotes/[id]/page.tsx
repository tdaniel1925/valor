import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { quotes, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { checkPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConvertToCase } from "@/components/quotes/convert-to-case"

export default async function QuoteDetailPage({
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

  const canViewQuotes = await checkPermission(authUser.id, "quotes", "read")
  if (!canViewQuotes) {
    redirect("/quotes")
  }

  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, params.id))
    .limit(1)

  if (!quote) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Quote not found</h1>
        <Link href="/quotes">
          <Button variant="outline" className="mt-4">Back to Quotes</Button>
        </Link>
      </div>
    )
  }

  const clientData = quote.clientData as any

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Quote {quote.quoteNumber || quote.id.substring(0, 8)}
          </h1>
          <p className="text-muted-foreground capitalize">{quote.type} Insurance Quote</p>
        </div>
        <div className="flex gap-2">
          <ConvertToCase quoteId={quote.id} quoteData={quote} />
          <Link href="/quotes">
            <Button variant="outline">Back to Quotes</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{clientData?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{clientData?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm">{clientData?.phone || "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Carrier</dt>
                <dd className="text-sm">{quote.carrier || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Product</dt>
                <dd className="text-sm">{quote.product || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Face Amount</dt>
                <dd className="text-sm">{quote.faceAmount || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Premium</dt>
                <dd className="text-sm">{quote.premium || "—"}</dd>
              </div>
              {quote.pdfUrl && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">PDF</dt>
                  <dd className="text-sm">
                    <a href={quote.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View PDF
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

