// Sentry client configuration
// This file is used by Sentry SDK

import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV

if (SENTRY_DSN) {
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
