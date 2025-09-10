import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== secretHash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Handle the webhook event
  if (body.event === "charge.completed") {
    console.log("✅ Payment successful:", body.data);
    // 👉 Update your DB, send email, etc.
  } else {
    console.log("⚡ Other event:", body.event);
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}
