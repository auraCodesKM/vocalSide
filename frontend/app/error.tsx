"use client"

import { useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 text-center">
        <h1 className="text-4xl font-bold text-red-500">Something went wrong!</h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="mt-8 space-x-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    </Layout>
  )
} 