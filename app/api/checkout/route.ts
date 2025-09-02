// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import Payment from "@/app/models/Payment";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// MongoDB connection helper
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: body.productName },
            unit_amount: body.amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      customer_email: body.email,
      success_url: "http://localhost:3002/success",
      cancel_url: "http://localhost:3002/cancel",
    });

  
    await connectDB();

    const payment = await Payment.create({
      userId: body.userId || null,
      email: body.email,
      amount: body.amount,
      currency: "usd",
      paymentStatus: session.payment_status, 
      paymentIntentId: session.payment_intent?.toString(),
      createdAt: new Date(),
    });
    console.log("payment", payment)
    // Return Stripe checkout URL
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
