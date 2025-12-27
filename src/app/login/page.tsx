import Link from "next/link";
import LoginForm from "@/components/login-form";

export default async function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-slate-600">
            Sign in to SaaS Platform Demo
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}