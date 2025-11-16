"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function PrintButton({ className, variant = "outline", size = "default" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button
      onClick={handlePrint}
      variant={variant}
      size={size}
      className={className}
    >
      <Printer className="mr-2 h-4 w-4" />
      Print
    </Button>
  )
}

