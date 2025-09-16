import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow access to public pages
  const publicPaths = ["/", "/auth/login", "/auth/signup", "/auth/success", "/auth/error"]
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Redirect unauthenticated users to login (except for public paths)
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/signup")) {
    const url = request.nextUrl.clone()

    // Get user profile to determine redirect
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role === "admin") {
      url.pathname = "/admin"
    } else {
      url.pathname = "/student"
    }
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    
    // Redirect admin users trying to access student pages
    if (profile?.role === "admin" && request.nextUrl.pathname.startsWith("/student")) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      return NextResponse.redirect(url)
    }
    
    // Redirect student users trying to access admin pages
    if (profile?.role === "student" && request.nextUrl.pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone()
      url.pathname = "/student"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
