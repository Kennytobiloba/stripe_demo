// app/success/page.tsx
interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your support. Your payment was processed successfully.
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stripe Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        )}

        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          Go back home
        </a>
      </div>
    </div>
  )
}
