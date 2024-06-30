import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const path = url.pathname;

  console.log('Path:', path);
  // console.log('Token:', token);

  // If user is authenticated
  if (token) {
    if (
      path === '/sign-in' ||
      path === '/sign-up' ||
      path === '/verify' ||
      path === '/'
    ) {
      console.log('Redirecting to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If user is not authenticated and trying to access the dashboard
    if (path.startsWith('/dashboard')) {
      console.log('Redirecting to /sign-in');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // If none of the conditions match, proceed with the request
  return NextResponse.next();
}

// Define the paths where the middleware should run
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
};
