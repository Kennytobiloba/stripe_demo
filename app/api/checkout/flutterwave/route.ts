import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, amount, productName } = body

    if (!email || !amount) {
      return NextResponse.json({ error: "Email and amount are required" }, { status: 400 })
    }

    // Flutterwave requires a unique transaction reference
    const tx_ref = `tx-${Date.now()}`

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: "USD", 
        redirect_url: "https://stripe-demo-git-main-kennytobilobas-projects.vercel.app/success", 
        customer: {
          email,
        },
        customizations: {
          title: productName || "Product Purchase",
          description: `Payment for ${productName}`,
        },
      }),
    })

    const data = await response.json()

    if (data.status !== "success") {
      return NextResponse.json({ error: data.message || "Flutterwave init failed" }, { status: 400 })
    }

    // Flutterwave returns payment link in `data.link`
    return NextResponse.json({ link: data.data.link })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
