import { NextResponse } from "next/server"
import crypto from "crypto"

// Replace with your Paystack secret
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY as string

export async function POST(req: Request) {
  try {
    const body = await req.text() // raw body
    const signature = req.headers.get("x-paystack-signature")

    // Verify Paystack signature
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET)
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Example: Save to DB when transaction is successful
    if (event.event === "charge.success") {
      const paymentData = {
        reference: event.data.reference,
        status: event.data.status,
        amount: event.data.amount / 100, 
        email: event.data.customer.email,
        gateway_response: event.data.gateway_response,
        paid_at: event.data.paid_at,
      }

     
      console.log("💰 Payment saved:", paymentData)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
