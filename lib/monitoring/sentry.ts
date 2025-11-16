// Sentry error tracking
// Install: npm install @sentry/nextjs
// Run: npx @sentry/wizard@latest -i nextjs

import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn("Sentry DSN not configured. Error tracking disabled.")
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
    debug: SENTRY_ENVIRONMENT === "development",
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        delete event.request.cookies
        if (event.request.headers) {
          delete event.request.headers["authorization"]
          delete event.request.headers["cookie"]
        }
      }
      return event
    },
  })
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    })
  }
  console.error("Error:", error, context)
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info", context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    })
  }
}

export function setUser(user: { id: string; email?: string; username?: string }) {
  if (SENTRY_DSN) {
    Sentry.setUser(user)
  }
}

export function clearUser() {
  if (SENTRY_DSN) {
    Sentry.setUser(null)
  }
}

