import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/student/student-dashboard"

export default async function StudentPage() {
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

  if (!profile || profile.role !== "student") {
    redirect("/auth/login")
  }

  // Get student's enrolled courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      courses (
        id,
        name,
        code,
        description
      )
    `,
    )
    .eq("student_id", user.id)

  // Get upcoming activities for enrolled courses
  const courseIds = enrollments?.map((e) => e.course_id) || []
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
    .in("course_id", courseIds)
    .gte("scheduled_date", new Date().toISOString())
    .order("scheduled_date", { ascending: true })
    .limit(10)

  // Get recent attendance records
  const { data: attendance } = await supabase
    .from("attendance")
    .select(
      `
      *,
      activities (
        title,
        activity_type,
        scheduled_date,
        courses (
          name,
          code
        )
      )
    `,
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <StudentDashboard
      profile={profile}
      enrollments={enrollments || []}
      activities={activities || []}
      attendance={attendance || []}
    />
  )
}
