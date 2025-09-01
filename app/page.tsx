"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    coffee: { email: "" },
    pizza: { email: "" },
    premium: { email: "" },
  })
  const { toast } = useToast()

  const handleSubmit = async (productType: "coffee" | "pizza" | "premium") => {
    const email = formData[productType].email

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    const paymentData = {
      coffee: { amount: 5, productName: "Coffee Support" },
      pizza: { amount: 15, productName: "Pizza Support" },
      premium: { amount: 50, productName: "Premium Support" },
    }

    setLoading(productType)

    try {
      console.log("[v0] Starting payment process for:", productType)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: paymentData[productType].amount,
          productName: paymentData[productType].productName,
        }),
      })

      const data = await response.json()
      console.log("[v0] Checkout response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Payment failed")
      }

      if (data.url) {
        console.log("[v0] Redirecting to Stripe checkout:", data.url)
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleInputChange = (productType: "coffee" | "pizza" | "premium", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [productType]: { email: value },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Learn Stripe Payment Integration</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A simple demo showing how to integrate Stripe payments with Next.js and MongoDB
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Coffee Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Buy Me a Coffee</CardTitle>
              <CardDescription>Support the developer</CardDescription>
              <div className="text-2xl font-bold text-primary">$5.00</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-coffee">Email Address</Label>
                  <Input
                    id="email-coffee"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.coffee.email}
                    onChange={(e) => handleInputChange("coffee", e.target.value)}
                    required
                  />
                </div>
                <Button onClick={() => handleSubmit("coffee")} disabled={loading === "coffee"} className="w-full">
                  {loading === "coffee" ? "Processing..." : "Pay $5"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pizza Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Buy Me Pizza</CardTitle>
              <CardDescription>Fuel the coding sessions</CardDescription>
              <div className="text-2xl font-bold text-primary">$15.00</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-pizza">Email Address</Label>
                  <Input
                    id="email-pizza"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.pizza.email}
                    onChange={(e) => handleInputChange("pizza", e.target.value)}
                    required
                  />
                </div>
                <Button onClick={() => handleSubmit("pizza")} disabled={loading === "pizza"} className="w-full">
                  {loading === "pizza" ? "Processing..." : "Pay $15"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Support */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-xl">Premium Support</CardTitle>
              <CardDescription>Get priority help</CardDescription>
              <div className="text-2xl font-bold text-primary">$50.00</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-premium">Email Address</Label>
                  <Input
                    id="email-premium"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.premium.email}
                    onChange={(e) => handleInputChange("premium", e.target.value)}
                    required
                  />
                </div>
                <Button onClick={() => handleSubmit("premium")} disabled={loading === "premium"} className="w-full">
                  {loading === "premium" ? "Processing..." : "Pay $50"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How This Demo Works</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  1
                </Badge>
                <p className="text-sm">Enter your email and click any payment button above</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  2
                </Badge>
                <p className="text-sm">
                  JavaScript sends a POST request to <code className="bg-muted px-1 rounded">/api/checkout</code> with
                  email, amount and product name
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  3
                </Badge>
                <p className="text-sm">Server creates a user in MongoDB and a Stripe Checkout Session</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  4
                </Badge>
                <p className="text-sm">User is redirected to Stripe's secure payment page</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  5
                </Badge>
                <p className="text-sm">After payment, user returns to success page with stored payment details</p>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Enhanced with JavaScript!</strong> Forms now use handleSubmit functions with proper loading
                  states, error handling, and toast notifications for better user experience.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
