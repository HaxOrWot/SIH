import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Shield, Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
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
              <Shield className="h-16 w-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-orange-700">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this resource.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
              <p className="text-sm text-orange-700">
                This page requires specific permissions that your account doesn't have. Please contact your
                administrator if you believe this is an error.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/login">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

