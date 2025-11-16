"use client"

import { useEffect, Suspense } from "react"
import * as Sentry from "@sentry/nextjs"
import { usePathname, useSearchParams } from "next/navigation"

function SentryTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      Sentry.setTag("page", pathname)
    }
  }, [pathname, searchParams])

  return null
}

export function SentryProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SentryTracker />
      </Suspense>
      {children}
    </>
  )
}

