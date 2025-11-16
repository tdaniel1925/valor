"use client"

// Sentry is currently disabled
// To enable: npm install @sentry/nextjs and configure in sentry.*.config.ts files

export function SentryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

