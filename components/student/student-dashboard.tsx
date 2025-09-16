"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  LogOut,
  GraduationCap,
  BarChart3,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  student_id: string
}

interface Course {
  id: string
  name: string
  code: string
  description: string
}

interface Enrollment {
  id: string
  course_id: string
  courses: Course
}

interface Activity {
  id: string
  title: string
  description: string
  activity_type: string
  scheduled_date: string
  duration_minutes: number
  courses: {
    name: string
    code: string
  }
}

interface AttendanceRecord {
  id: string
  status: string
  check_in_time: string
  activities: {
    title: string
    activity_type: string
    scheduled_date: string
    courses: {
      name: string
      code: string
    }
  }
}

interface StudentDashboardProps {
  profile: Profile
  enrollments: Enrollment[]
  activities: Activity[]
  attendance: AttendanceRecord[]
}

export function StudentDashboard({ profile, enrollments, activities, attendance }: StudentDashboardProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "excused":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "lab":
        return "bg-purple-100 text-purple-800"
      case "assignment":
        return "bg-orange-100 text-orange-800"
      case "exam":
        return "bg-red-100 text-red-800"
      case "project":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  }

  const attendanceRate = attendanceStats.total > 0 ? (attendanceStats.present / attendanceStats.total) * 100 : 0

  // Calculate this week's activities
  const thisWeekActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.scheduled_date)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return activityDate >= now && activityDate <= weekFromNow
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Curriculum</h1>
              <p className="text-sm text-gray-600">Student Dashboard</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {profile.student_id}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name}!</h2>
          <p className="text-gray-600">Here's what's happening with your courses and activities.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Activities</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
              <p className="text-xs text-muted-foreground">Next 10 activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.present} of {attendanceStats.total} attended
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {thisWeekActivities}
              </div>
              <p className="text-xs text-muted-foreground">Activities this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Activities
              </CardTitle>
              <CardDescription>Your scheduled activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming activities</p>
                ) : (
                  activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <Badge className={getActivityTypeColor(activity.activity_type)} variant="secondary">
                            {activity.activity_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {activity.courses.code} - {activity.courses.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(activity.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                          {activity.duration_minutes && ` (${activity.duration_minutes} min)`}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No attendance records yet</p>
                ) : (
                  attendance.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{record.activities.title}</h4>
                          <Badge className={getStatusColor(record.status)} variant="secondary">
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {record.activities.courses.code} - {record.activities.courses.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(record.activities.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {record.status === "present" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {record.status === "absent" && <XCircle className="h-4 w-4 text-red-500" />}
                        {record.status === "late" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {record.status === "excused" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Enrolled Courses
            </CardTitle>
            <CardDescription>Courses you are currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 col-span-full">
                  No course enrollments found
                </p>
              ) : (
                enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="border-2 hover:border-blue-200 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{enrollment.courses.code}</Badge>
                      </div>
                      <CardTitle className="text-lg">{enrollment.courses.name}</CardTitle>
                      {enrollment.courses.description && (
                        <CardDescription className="text-sm">{enrollment.courses.description}</CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
