import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/auth/login")
  }

  // Get all courses
  const { data: courses } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

  // Get all students
  const { data: students } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, student_id, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false })

  // Get recent activities
  const { data: activities } = await supabase
    .from("activities")
    .select(
      `
      *,
      courses (
        name,
        code
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10)

  // Get attendance statistics
  const { data: attendanceStats } = await supabase.from("attendance").select("status")

  // Get enrollment statistics
  const { data: enrollments } = await supabase.from("enrollments").select("*")

  // Ensure we have valid data arrays
  const validCourses = courses || []
  const validStudents = students || []
  const validActivities = activities || []
  const validAttendanceStats = attendanceStats || []
  const validEnrollments = enrollments || []

  return (
    <AdminDashboard
      profile={profile}
      courses={validCourses}
      students={validStudents}
      activities={validActivities}
      attendanceStats={validAttendanceStats}
      enrollments={validEnrollments}
    />
  )
}
