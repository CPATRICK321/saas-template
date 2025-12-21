"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { checkSubscription } from "@/lib/subscription"
import Stripe from "stripe"

const FREE_PROJECT_LIMIT = 1

export async function createProject(formData: FormData) {

    // authenticate user
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const isPro = await checkSubscription(session.user.id)

    const projectCount = await prisma.project.count({
        where: { userId: session.user.id },
    })

    if (!isPro && projectCount >= FREE_PROJECT_LIMIT) {
        return {
            status: "error",
            message: "Free limit reached. Upgrade to create more.",
        }
    }

    // get form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    // create project in the db
    await prisma.project.create({
        data: {
            name,
            description,
            userId: session.user.id,
        },
    })

    // purge cached data for the dashboard page
    revalidatePath("/dashboard")

    return { 
        status: "success", 
        message: "Project created successfully!"
    }
}


export async function deleteProject(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const projectId = formData.get("projectId") as string

    await prisma.project.deleteMany({
        where: {
            id: projectId,
            userId: session.user.id, // important, only delete my own project
        },
    })

  revalidatePath("/dashboard")
}

export async function createSubscription() {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    // essentially filling out an order form for a subscription
    const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email,
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard?canceled=true`,
        metadata: {
            userId: session.user.id
        },
    })

    return checkoutSession.url
}

export async function createCustomerPortal() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
        throw new Error("No Stripe customer ID found")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard`,
    })

    return portalSession.url
}