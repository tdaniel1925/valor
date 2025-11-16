import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-4">Valor Financial Specialists</h1>
        <p className="mt-4 text-2xl text-gray-600 mb-12">Insurance Back Office Platform</p>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/auth/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

