import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
export {default} from 'next-auth/middleware'
 
export async function middleware(request: NextRequest) {
  const token = await getToken({req:request})
  // konse current url pe hai uske liye
  const url = request.nextUrl

  if(token && (
      url.pathname.startsWith('/sign-in') || 
      url.pathname.startsWith('/sign-up') || 
      url.pathname.startsWith('/verify') || 
      url.pathname.startsWith('/') )
    ){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if(!token && url.pathname.startsWith('/dashboard') ){
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  // return NextResponse.next()
  return 
}
 
// ye file define karti hai ki middleware kon kon se path pe run kare 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}