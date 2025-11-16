// Helper functions for showing toast notifications
import { toast } from "@/hooks/use-toast"

export function showSuccess(message: string, title?: string) {
  toast({
    variant: "success",
    title: title || "Success",
    description: message,
  })
}

export function showError(message: string, title?: string) {
  toast({
    variant: "destructive",
    title: title || "Error",
    description: message,
  })
}

export function showInfo(message: string, title?: string) {
  toast({
    title: title || "Info",
    description: message,
  })
}

export function showWarning(message: string, title?: string) {
  toast({
    variant: "destructive",
    title: title || "Warning",
    description: message,
  })
}

