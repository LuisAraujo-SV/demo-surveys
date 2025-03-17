import { NextResponse } from 'next/server';

export default async function middleware(request) {
  console.log("middleware executed on: ", request.nextUrl.pathname);

  // Get token from cookies
  const token = request.cookies.get('token');

  const protectedPaths = ['/dashboard', '/profile', '/surveys'];

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !token) {
    console.log('Redirecting to login page');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('User is authenticated');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
