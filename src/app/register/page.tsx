"use client"

import { registerUser, loginWithGitHub } from "@/app/actions"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await registerUser(formData)

        if (result.status === "success") {
            toast.success(result.message)
            router.push("/api/auth/signin")

        } else {
            toast.error(result.message)
        }

        setIsLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Name</label>
                        <input name="name" type="text" className="w-full p-2 border rounded mt-1" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input name="email" type="email" required className="w-full p-2 border rounded mt-1" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input name="password" type="password" required className="w-full p-2 border rounded mt-1" placeholder="••••••••" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Sign Up"}
                    </button>
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
                        Sign up with GitHub
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
                    <Link href="/api/auth/signin" className="text-blue-600 hover:underline">
            Sign In
                    </Link>
                </p>
             </div>
        </div>
  )
}