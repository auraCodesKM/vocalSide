import { Layout } from "@/components/layout"

export default function Loading() {
  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    </Layout>
  )
} 