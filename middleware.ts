import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const hasSessionCookie = request.cookies.get('quantify_session')?.value === 'active'
  const hasSupabaseCookie = request.cookies.getAll().some(
    (c) => c.name.includes('auth-token') || c.name.includes('supabase')
  )

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Fast path: if session cookies are present, pass immediately without remote network latency
  if (hasSessionCookie || hasSupabaseCookie) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpegmwrbdixvwwjfhhuo.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZWdtd3JiZGl4dnd3amZoaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjkxMzEsImV4cCI6MjEwNTQwNTEzMX0.KCivauv0Ekgm4DToiypX0QqqxIE8ErKtCTrlaOg21vc',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assessment/:path*',
    '/path/:path*',
    '/quiz/:path*',
    '/topic/:path*',
    '/resources/:path*',
    '/books/:path*',
    '/simulator/:path*',
    '/tutor/:path*',
    '/achievements/:path*',
    '/profile/:path*',
    '/admin/:path*'
  ],
}
