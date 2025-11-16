"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { showSuccess } from "@/lib/utils/toast-helpers"

interface CopyButtonProps {
  text: string
  label?: string
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CopyButton({
  text,
  label = "Copy",
  variant = "outline",
  size = "default",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showSuccess("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={className}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

