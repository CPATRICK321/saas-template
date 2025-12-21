import { prisma } from "@/lib/prisma"

const DAY_IN_MS = 24 * 60 * 60 * 1000

export async function checkSubscription(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripeCurrentPeriodEnd: true,
            stripePriceId: true,
        },
    })

    if (!user) {
        return false
    }

    const isValid = user.stripeSubscriptionId &&
        user.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now()

    return !!isValid
}