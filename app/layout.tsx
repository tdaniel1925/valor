import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Valor Financial Specialists - Insurance Platform",
  description: "Unified insurance back office platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

