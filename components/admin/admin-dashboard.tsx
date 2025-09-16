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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  User,
  LogOut,
  GraduationCap,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { format } from "date-fns"

interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  student_id?: string
  created_at?: string
}

interface Course {
  id: string
  name: string
  code: string
  description: string
  instructor_id: string
  created_at: string
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
  status: string
}

interface Enrollment {
  id: string
  course_id: string
  student_id: string
}

interface AdminDashboardProps {
  profile: Profile
  courses: Course[]
  students: Profile[]
  activities: Activity[]
  attendanceStats: AttendanceRecord[]
  enrollments: Enrollment[]
}

export function AdminDashboard({
  profile,
  courses,
  students,
  activities,
  attendanceStats,
  enrollments,
}: AdminDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false)

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

  const attendanceStatistics = {
    total: attendanceStats.length,
    present: attendanceStats.filter((a) => a.status === "present").length,
    absent: attendanceStats.filter((a) => a.status === "absent").length,
    late: attendanceStats.filter((a) => a.status === "late").length,
    excused: attendanceStats.filter((a) => a.status === "excused").length,
  }

  const overallAttendanceRate =
    attendanceStatistics.total > 0 ? (attendanceStatistics.present / attendanceStatistics.total) * 100 : 0

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement course creation
    console.log("Create course functionality to be implemented")
    setIsCreateCourseOpen(false)
  }

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement activity creation
    console.log("Create activity functionality to be implemented")
    setIsCreateActivityOpen(false)
  }

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
              <p className="text-sm text-gray-600">Admin Dashboard</p>
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
                  <Badge variant="secondary" className="w-fit">
                    Administrator
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
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
          <p className="text-gray-600">Manage your institution's curriculum activities and attendance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Available courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">Course enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAttendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Overall attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest scheduled activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Attendance Overview
                  </CardTitle>
                  <CardDescription>System-wide attendance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Present</span>
                      </div>
                      <div className="text-sm font-medium">{attendanceStatistics.present}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Absent</span>
                      </div>
                      <div className="text-sm font-medium">{attendanceStatistics.absent}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm">Late</span>
                      </div>
                      <div className="text-sm font-medium">{attendanceStatistics.late}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">Excused</span>
                      </div>
                      <div className="text-sm font-medium">{attendanceStatistics.excused}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Management</h3>
              <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Add a new course to the curriculum.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input id="courseName" placeholder="Introduction to Computer Science" />
                    </div>
                    <div>
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input id="courseCode" placeholder="CS101" />
                    </div>
                    <div>
                      <Label htmlFor="courseDescription">Description</Label>
                      <Textarea id="courseDescription" placeholder="Course description..." />
                    </div>
                    <Button type="submit" className="w-full">Create Course</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                        <TableCell>{format(new Date(course.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Student Management</h3>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.student_id || "N/A"}</TableCell>
                        <TableCell>{student.full_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.created_at ? format(new Date(student.created_at), "MMM dd, yyyy") : "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Activity Management</h3>
              <Dialog open={isCreateActivityOpen} onOpenChange={setIsCreateActivityOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Activity</DialogTitle>
                    <DialogDescription>Schedule a new curriculum activity.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <Label htmlFor="activityTitle">Activity Title</Label>
                      <Input id="activityTitle" placeholder="Lecture: Introduction to Algorithms" />
                    </div>
                    <div>
                      <Label htmlFor="activityType">Activity Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Lecture</SelectItem>
                          <SelectItem value="lab">Lab</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activityCourse">Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activityDate">Scheduled Date & Time</Label>
                      <Input id="activityDate" type="datetime-local" />
                    </div>
                    <div>
                      <Label htmlFor="activityDuration">Duration (minutes)</Label>
                      <Input id="activityDuration" type="number" placeholder="90" />
                    </div>
                    <Button type="submit" className="w-full">Create Activity</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.title}</TableCell>
                        <TableCell>
                          <Badge className={getActivityTypeColor(activity.activity_type)} variant="secondary">
                            {activity.activity_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{activity.courses.code}</TableCell>
                        <TableCell>{format(new Date(activity.scheduled_date), "MMM dd, yyyy h:mm a")}</TableCell>
                        <TableCell>{activity.duration_minutes} min</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Attendance Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{attendanceStatistics.present}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{attendanceStatistics.absent}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">Late</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{attendanceStatistics.late}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Excused</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{attendanceStatistics.excused}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Generate and view detailed attendance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline">Generate Report</Button>
                  <Button variant="outline">Export Data</Button>
                  <Button variant="outline">View Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
