import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, GraduationCap } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Curriculum</h1>
          <p className="text-gray-600">Activity & Attendance Management</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-red-700">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground bg-red-50 border border-red-200 p-3 rounded-md">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">An unexpected error occurred during authentication.</p>
            )}
            <div className="pt-4">
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Try Again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
