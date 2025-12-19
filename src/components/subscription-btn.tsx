"use client"

import { createSubscription } from "@/app/actions"
import { useState } from "react"

export default function SubscriptionBtn() {
    const [isloading, setIsLoading] = useState(false)

    const handleSubscribe = async () => {
        setIsLoading(true)
        try {
            const url = await createSubscription()
            if (url) {
                window.location.href = url // user sent to stripe
            }
        } catch (error) {
            console.error
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleSubscribe}
            disabled={isloading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50">

            {isloading ? "Loading..." : "Upgrade to Pro ($10/month)"}
            
        </button>
    )
}