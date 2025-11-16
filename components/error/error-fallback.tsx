"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Error boundary caught:", error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer">
                    Stack trace
                  </summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
          <div className="flex gap-2">
            {resetErrorBoundary && (
              <Button onClick={resetErrorBoundary}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Link href="/dashboard">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

