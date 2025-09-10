import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/app/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  console.log("⚡ Webhook endpoint called");
  console.log("✅ Connected to MongoDB");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error(" Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    let subscription: Stripe.Subscription | null = null;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
    }

    const payment = new Payment({
      userId: session.metadata?.userId || null,
      email: session.customer_email,
      amount: session.amount_total, 
      currency: session.currency,
      paymentStatus: session.payment_status,
      subscriptionId: subscription?.id,
      currentPeriodStart: subscription ? new Date((subscription as any).current_period_start * 1000) : null, 
      currentPeriodEnd: subscription ? new Date((subscription as any).current_period_end * 1000) : null,     
    });


     await payment.save();
    console.log("💾 Payment saved:", payment);
  }

  return NextResponse.json({ received: true });
}
