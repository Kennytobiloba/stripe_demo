import Subscription from "@/app/models/Subscription"
import User from "@/app/models/User"
import { connectDB } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("[v0] Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("[v0] Webhook event received:", event.type)

    await connectDB()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[v0] Checkout session completed:", session.id)

        // Find user by metadata
        const userId = session.metadata?.userId
        if (!userId) {
          console.error("[v0] No user ID in session metadata")
          break
        }

        const user = await User.findById(userId)
        if (!user) {
          console.error("[v0] User not found:", userId)
          break
        }

        // Update user with Stripe customer ID
        if (session.customer && !user.stripeCustomerId) {
          user.stripeCustomerId = session.customer as string
          await user.save()
        }

        // For one-time payments, we can create a "purchase" record
        // This is a simplified approach - in a real subscription system,
        // you'd handle subscription.created events instead
        console.log("[v0] Payment completed for user:", user.email)
        break
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription created:", subscription.id)

        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (!customer || customer.deleted) break

        const user = await User.findOne({ stripeCustomerId: customer.id })
        if (!user) {
          console.error("[v0] User not found for customer:", customer.id)
          break
        }

        // Create subscription record
        const newSubscription = new Subscription({
          userId: user._id,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: customer.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          planName: subscription.items.data[0].price.nickname || "Unknown Plan",
          amount: subscription.items.data[0].price.unit_amount! / 100,
          currency: subscription.items.data[0].price.currency,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })

        await newSubscription.save()
        console.log("[v0] Subscription saved to database")
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription updated:", subscription.id)

        const dbSubscription = await Subscription.findOne({
          stripeSubscriptionId: subscription.id,
        })

        if (dbSubscription) {
          dbSubscription.status = subscription.status
          dbSubscription.currentPeriodStart = new Date((subscription as any).current_period_start * 1000)
          dbSubscription.currentPeriodEnd = new Date((subscription as any).current_period_end * 1000)
          dbSubscription.cancelAtPeriodEnd = subscription.cancel_at_period_end
          await dbSubscription.save()
          console.log("[v0] Subscription updated in database")
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription deleted:", subscription.id)

        const dbSubscription = await Subscription.findOne({
          stripeSubscriptionId: subscription.id,
        })

        if (dbSubscription) {
          dbSubscription.status = "canceled"
          await dbSubscription.save()
          console.log("[v0] Subscription marked as canceled in database")
        }
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
