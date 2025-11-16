import { createClient } from "./client"

export const STORAGE_BUCKETS = {
  documents: "documents",
  quotes: "quotes",
  attachments: "attachments",
} as const

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: { contentType?: string; upsert?: boolean }
) {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
    })

  if (error) {
    throw error
  }

  return data
}

export async function getPublicUrl(bucket: string, path: string) {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  
  if (error) {
    throw error
  }
}

export async function listFiles(bucket: string, folder?: string) {
  const supabase = createClient()
  const { data, error } = await supabase.storage.from(bucket).list(folder)
  
  if (error) {
    throw error
  }

  return data
}

