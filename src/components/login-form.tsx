"use client"

import { loginWithCredentials, loginWithGitHub } from "@/app/actions"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCredentialsLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            const result = await loginWithCredentials(formData)

            if (result?.status === "error") {
                toast.error(result.message)
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            toast.error("An error occurred during login.")
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Email/Password Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full border rounded-md p-2 bg-slate-50"
                    placeholder="name@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full border rounded-md p-2 bg-slate-50"
                    placeholder="••••••••"
                />
            </div>
            <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
            >
            {isLoading ? "Signing in..." : "Sign in with Email"}
            </Button>
      </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
        </div>

        <form
            action={async () => {
                await loginWithGitHub()
            }}
        >
            <Button variant="outline" type="submit" className="w-full">
                Sign in with GitHub
            </Button>
        </form>
    </div>
  )
}