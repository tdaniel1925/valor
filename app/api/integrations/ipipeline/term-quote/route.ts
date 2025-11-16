import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getIPipelineIntegration, getIntegrationConfigs } from "@/lib/integrations"
import { checkPermission } from "@/lib/permissions"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canCreateQuotes = await checkPermission(user.id, "quotes", "write")
    if (!canCreateQuotes) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const configs = getIntegrationConfigs()
    const integration = getIPipelineIntegration(configs.ipipeline)

    const quote = await integration.generateTermQuote(body)

    return NextResponse.json(quote)
  } catch (error: any) {
    console.error("Error generating iPipeline term quote:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate quote" },
      { status: 500 }
    )
  }
}

