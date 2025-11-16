"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/utils/copy-helpers"
import { showSuccess, showError } from "@/lib/utils/toast-helpers"
import { cn } from "@/lib/utils"

interface CopyToClipboardProps {
  text: string
  label?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showLabel?: boolean
}

export function CopyToClipboard({
  text,
  label = "Copy",
  variant = "outline",
  size = "sm",
  className,
  showLabel = true,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      showSuccess("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } else {
      showError("Failed to copy to clipboard")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(className)}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {showLabel && "Copied"}
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {showLabel && label}
        </>
      )}
    </Button>
  )
}

