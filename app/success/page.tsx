import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface SuccessPageProps {
  searchParams: {
    session_id?: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-200">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your subscription. Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Session ID:</p>
              <p className="text-xs font-mono break-all text-muted-foreground">{sessionId}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• You will receive a confirmation email shortly</p>
            <p>• Your subscription is now active</p>
            <p>• You can manage your subscription in your account</p>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
