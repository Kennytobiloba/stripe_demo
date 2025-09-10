import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/app/models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: body.productName },
            unit_amount: body.amount * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: body.email,
      success_url: "https://stripe-demo-git-main-kennytobilobas-projects.vercel.app/success",
      cancel_url: "https://stripe-demo-git-main-kennytobilobas-projects.vercel.app/cancel",
    });

    // await connectDB();

    // const payment = await Payment.create({
    //   userId: body.userId || null,
    //   email: body.email,
    //   amount: body.amount,
    //   currency: "usd",
    //   paymentStatus: session.payment_status,
    //   paymentIntentId: session.payment_intent?.toString(),
    //   createdAt: new Date(),
    // });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
