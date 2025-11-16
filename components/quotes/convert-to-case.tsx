"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { showSuccess, showError } from "@/lib/utils/toast-helpers"
import { logQuoteConverted } from "@/lib/activity-log"

interface ConvertToCaseProps {
  quoteId: string
  quoteData: {
    type: string
    carrier?: string | null
    product?: string | null
    clientData?: any
  }
}

export function ConvertToCase({ quoteId, quoteData }: ConvertToCaseProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    setLoading(true)
    try {
      const clientInfo = quoteData.clientData || {}

      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: quoteData.type,
          status: "draft",
          clientInfo,
          carrier: quoteData.carrier,
          product: quoteData.product,
        }),
      })

      if (response.ok) {
        const newCase = await response.json()
        
        // Log activity (we'll need to get user ID from a hook or context)
        // For now, we'll log it on the server side in the API route
        
        showSuccess("Quote converted to case successfully")
        router.push(`/cases/${newCase.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        showError(error.message || "Failed to convert quote to case")
      }
    } catch (error) {
      console.error("Failed to convert quote to case:", error)
      showError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Convert to Case
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Convert Quote to Case</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a new case from this quote. The quote information will be copied
            to the case, and you can then submit it for processing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

