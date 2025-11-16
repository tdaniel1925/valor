"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { usePathname, useSearchParams } from "next/navigation"

export function SentryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      Sentry.setTag("page", pathname)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

