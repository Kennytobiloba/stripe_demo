"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    coffee: { email: "", method: "stripe" },
    pizza: { email: "", method: "stripe" },
    premium: { email: "", method: "stripe" },
  })
  const { toast } = useToast()

  const handleSubmit = async (productType: "coffee" | "pizza" | "premium") => {
    const email = formData[productType].email
    const paymentMethod = formData[productType].method

    if (!email) {
      alert("Please enter your email address")
      // toast({
      //   title: "Email Required",
      //   description: "Please enter your email address",
      //   variant: "destructive",
      // })
      return
    }

    const paymentData = {
      coffee: { amount: 5, productName: "Coffee Support" },
      pizza: { amount: 15, productName: "Pizza Support" },
      premium: { amount: 50, productName: "Premium Support" },
    }

    setLoading(productType)

    try {
      let response

      if (paymentMethod === "stripe") {
        response = await fetch("/api/checkout/stripepayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            amount: paymentData[productType].amount,
            productName: paymentData[productType].productName,
          }),
        })
      } else if (paymentMethod === "paystack") {
        response = await fetch("/api/checkout/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            amount: paymentData[productType].amount * 100, // Paystack requires kobo
            productName: paymentData[productType].productName,
          }),
        })
      } else if (paymentMethod === "flutterwave") {
        response = await fetch("/api/checkout/flutterwave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            amount: paymentData[productType].amount,
            productName: paymentData[productType].productName,
          }),
        })
      }

      const data = await response?.json()
      if (!response?.ok) throw new Error(data.error || "Payment failed")

      if (paymentMethod === "stripe" && data.url) {
        window.location.href = data.url
      } else if (paymentMethod === "paystack" && data.authorization_url) {
        window.location.href = data.authorization_url
      } else if (paymentMethod === "flutterwave" && data.link) {
        window.location.href = data.link
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
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
      [productType]: { ...prev[productType], email: value },
    }))
  }

  const handleMethodChange = (
    productType: "coffee" | "pizza" | "premium",
    method: "stripe" | "paystack" | "flutterwave"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [productType]: { ...prev[productType], method },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Stripe + Paystack + Flutterwave Integration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a product and pay using Stripe, Paystack or Flutterwave
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {(["coffee", "pizza", "premium"] as const).map((product) => (
            <Card key={product}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {product === "coffee" && "Buy Me a Coffee"}
                  {product === "pizza" && "Buy Me Pizza"}
                  {product === "premium" && "Premium Support"}
                </CardTitle>
                <CardDescription>
                  {product === "coffee" && "Support the developer"}
                  {product === "pizza" && "Fuel the coding sessions"}
                  {product === "premium" && "Get priority help"}
                </CardDescription>
                <div className="text-2xl font-bold text-primary">
                  {product === "coffee" && "$5.00"}
                  {product === "pizza" && "$15.00"}
                  {product === "premium" && "$50.00"}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${product}`}>Email Address</Label>
                    <Input
                      id={`email-${product}`}
                      type="email"
                      placeholder="your@email.com"
                      value={formData[product].email}
                      onChange={(e) => handleInputChange(product, e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Choose Payment Method</Label>
                    <Select
                      value={formData[product].method}
                      onValueChange={(val: "stripe" | "paystack" | "flutterwave") =>
                        handleMethodChange(product, val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paystack">Paystack</SelectItem>
                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleSubmit(product)} disabled={loading === product} className="w-full">
                    {loading === product ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
