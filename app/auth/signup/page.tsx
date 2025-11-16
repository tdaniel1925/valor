"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/auth/verify-email")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
            <h2 className="text-center text-2xl font-bold text-blue-900">
              New User Registration
            </h2>
            <p className="mt-1 text-center text-sm text-blue-700">
              Create a new account to get started
            </p>
          </div>
          <p className="text-center text-sm text-gray-600">
            Valor Financial Specialists
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-white text-gray-900"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-900 font-semibold">Password (minimum 6 characters)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-white text-gray-900"
                placeholder="Create a password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-white text-gray-900"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <div className="text-center">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>
            <Link href="/auth/login">
              <Button type="button" variant="outline" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

