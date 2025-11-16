"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { SentryProvider } from "./sentry-provider"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SentryProvider>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </SentryProvider>
    </ThemeProvider>
  )
}

