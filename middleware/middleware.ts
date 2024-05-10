import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl
    if(token){
        if(url.pathname === '/signin' || url.pathname === '/signup' || url.pathname === '/verify' || url.pathname === '/'){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }
        if(!token && url.pathname === '/dashboard'){
            return NextResponse.redirect(new URL('/signin', request.url))
        }
    return NextResponse.next()
    }

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}