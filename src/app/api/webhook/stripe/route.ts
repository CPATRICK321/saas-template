import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error) {
        return new NextResponse("Invalid signature", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any

        const userId = session.metadata?.userId;

        if (!userId) {
            return NextResponse.json({ error: "Missing user ID in session metadata" }, { status: 400 });
        }

        // If it's missing, default to "now" + 30 days to prevent crashing
        const currentPeriodEnd = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000) 
            : new Date(Date.now() + 86400000 * 30); 

        if (!subscription.current_period_end) {
            console.log("WARNING: Subscription missing current_period_end", subscription);
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: currentPeriodEnd,
            }
        })

        console.log("User upgraded to Pro:", userId, );
    }

    if (event.type === "invoice.payment_succeeded") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as Stripe.Invoice as any;
        const subscriptionId = invoice.subscription as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

        await prisma.user.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        });
    }

    return new NextResponse("Received", { status: 200 });
}

