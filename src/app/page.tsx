import { auth } from "@/auth"
import Link from "next/link";

export default async function Home() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="text-xl font-bold text-slate-900">SaaS Platform Demo</div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
                  Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-12 mb-20">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl mb-6">
          Manage your projects <br className="hidden sm:block" />
          <span className="text-blue-600">without limits.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          The simplest way to track your work. Start for free, upgrade for power. 
          Join thousands of developers managing their best ideas here.
        </p>

        <div className="flex gap-4">
          {user ? (
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              href="/register" 
              className="bg-slate-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Start for Free
            </Link>
          )}
        </div>
      </main>

      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center mb-16 px-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that matches your ambition. Upgrade or downgrade at any time.
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          {/* Free Tier */}
          <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900">Free Starter</h3>
            <p className="text-3xl font-bold mt-4">$0 <span className="text-base font-normal text-slate-500">/month</span></p>
            <p className="text-slate-600 mt-2">Perfect for hobbyists.</p>
            <ul className="mt-6 space-y-3 text-slate-600 flex-1">
              <li className="flex items-center">✓ 1 Project Limit</li>
              <li className="flex items-center">✓ Basic Features</li>
              <li className="flex items-center">✓ Community Support</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="p-8 border-2 border-slate-900 rounded-2xl relative flex flex-col">
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pro Plan</h3>
            <p className="text-3xl font-bold mt-4">$10 <span className="text-base font-normal text-slate-500">/month</span></p>
            <p className="text-slate-600 mt-2">For serious builders.</p>
            <ul className="mt-6 space-y-3 text-slate-900 font-medium flex-1">
              <li className="flex items-center">✓ Unlimited Projects</li>
              <li className="flex items-center">✓ Priority Support</li>
              <li className="flex items-center">✓ Early Access to Features</li>
            </ul>
          </div>

        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} SaaS Platform Demo. All rights reserved.
      </footer>
    </div>
  );
}