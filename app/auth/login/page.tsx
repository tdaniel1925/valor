"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { loginAction } from "./actions"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleLogin = async (formData: FormData) => {
    setError(null)
    setLoading(true)

    const result = await loginAction(formData)

    if (result.success) {
      // Force a full page reload to ensure cookies are sent with the request
      window.location.href = "/dashboard"
    } else if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
            <h2 className="text-center text-2xl font-bold text-green-900">
              Existing User Sign In
            </h2>
            <p className="mt-1 text-center text-sm text-green-700">
              Access your account
            </p>
          </div>
          <p className="text-center text-sm text-gray-600">
            Valor Financial Specialists
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email" className="text-gray-900 font-semibold">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 bg-white text-gray-900"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-900 font-semibold">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 bg-white text-gray-900"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button>
          </div>

          <div className="text-center">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">New to Valor?</span>
              </div>
            </div>
            <Link href="/auth/signup">
              <Button type="button" variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

