// app/api/checkout/paystack/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, amount } = body

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: "https://stripe-demo-git-main-kennytobilobas-projects.vercel.app/success", 
      }),
    })

    const data = await response.json()
    if (!data.status) {
      return Response.json({ error: data.message }, { status: 400 })
    }

    return Response.json(data.data, { status: 200 }) // contains `authorization_url`
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
