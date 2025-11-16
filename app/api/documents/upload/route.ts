import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const folder = (formData.get("folder") as string) || ""

    if (!file || !bucket) {
      return NextResponse.json(
        { error: "File and bucket are required" },
        { status: 400 }
      )
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${folder ? `${folder}/` : ""}${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    })
  } catch (error: any) {
    console.error("Error uploading document:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload document" },
      { status: 500 }
    )
  }
}

