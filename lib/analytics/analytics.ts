// Analytics tracking
// Supports Google Analytics 4 and Plausible

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    plausible?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * Initialize Google Analytics
 */
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") return

  // Load GA script
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag("js", new Date())
  gtag("config", measurementId, {
    page_path: window.location.pathname,
  })
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined") return

  // Google Analytics
  if (window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
      page_title: title,
    })
  }

  // Plausible
  if (window.plausible) {
    window.plausible("pageview", {
      url,
    })
  }
}

/**
 * Track event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window === "undefined") return

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, eventParams)
  }

  // Plausible
  if (window.plausible) {
    window.plausible(eventName, {
      props: eventParams,
    })
  }
}

/**
 * Track conversion
 */
export function trackConversion(conversionId: string, value?: number) {
  trackEvent("conversion", {
    conversion_id: conversionId,
    value,
  })
}

/**
 * Track user action
 */
export function trackUserAction(action: string, details?: Record<string, any>) {
  trackEvent("user_action", {
    action,
    ...details,
  })
}

