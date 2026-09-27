import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired and grab user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // 1. BLOCK: Logged-in users trying to hit Auth pages
  if (user && (url.pathname === '/login' || url.pathname === '/register')) {
    // Fetch their role to redirect them to their specific dashboard
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (userData?.role === 'provider') {
      url.pathname = '/provider/dashboard'
    } else if (userData?.role === 'farmer') {
      url.pathname = '/farmer/dashboard'
    } else {
      url.pathname = '/map'
    }
    return NextResponse.redirect(url)
  }

  // 2. BLOCK: Logged-out users trying to hit Protected Dashboards
  if (!user && (url.pathname.startsWith('/farmer') || url.pathname.startsWith('/provider'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}