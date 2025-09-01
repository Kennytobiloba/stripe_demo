// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
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
    success_url: "http://localhost:3002/success",
    cancel_url: "http://localhost:3002/cancel",
  });

  // return URL for redirect
  return NextResponse.json({ url: session.url });
}
