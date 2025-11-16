import { Loader2 } from "lucide-react"

export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
  )
}

