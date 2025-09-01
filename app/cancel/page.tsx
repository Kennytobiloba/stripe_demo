import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-red-800 dark:text-red-200">Payment Cancelled</CardTitle>
          <CardDescription>Your payment was cancelled. No charges have been made to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Your subscription was not activated</p>
            <p>• No payment was processed</p>
            <p>• You can try again anytime</p>
          </div>

          <div className="pt-4 space-y-2">
            <Link href="/">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link href="mailto:support@example.com">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
