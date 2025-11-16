"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, File } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DocumentUploadProps {
  bucket: string
  folder?: string
  onUploadComplete?: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
}

export function DocumentUpload({
  bucket,
  folder = "",
  onUploadComplete,
  onError,
  accept = "*/*",
  maxSize = 10,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file size
    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      onError?.(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const supabase = createClient()
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
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setProgress(100)
      onUploadComplete?.(urlData.publicUrl)
      setFile(null)
    } catch (error: any) {
      console.error("Upload error:", error)
      onError?.(error.message || "Failed to upload file")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setProgress(0)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">Upload Document</Label>
        <div className="mt-2 flex items-center gap-4">
          <Input
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
          {file && (
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {maxSize && (
          <p className="mt-1 text-xs text-muted-foreground">
            Maximum file size: {maxSize}MB
          </p>
        )}
      </div>

      {file && !uploading && (
        <Button onClick={handleUpload} type="button">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}
    </div>
  )
}

