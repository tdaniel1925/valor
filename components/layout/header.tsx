"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MobileNav />
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/dashboard">
            <span className="font-bold">Valor Financial Specialists</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <a
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/quotes"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Quotes
            </a>
            <a
              href="/cases"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Cases
            </a>
            <a
              href="/contracts"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contracts
            </a>
            <ThemeToggle />
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

