"use client"

import { createCustomerPortal, createSubscription } from "@/app/actions"
import { useState } from "react"
import toast from "react-hot-toast"

export default function SubscriptionBtn({ isPro }: { isPro: boolean }) {
    const [isloading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        try {
            const action = isPro ? createCustomerPortal : createSubscription

            const url = await action()
            if (url) {
                window.location.href = url // user sent to stripe
            } else {
                toast.error("Something went wrong.")
            }
        } catch (error) {
            console.error
            toast.error("An error occurred.")
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isloading}
            className={`font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 ${
        isPro 
          ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" // Light button for Pro
          : "bg-slate-900 text-white hover:bg-slate-800" // Dark button for Free
      }`}>

            {isloading ? "Loading..." : isPro ? "Manage Subscription" : "Upgrade to Pro ($10/mo)"}
            
        </button>
    )
}