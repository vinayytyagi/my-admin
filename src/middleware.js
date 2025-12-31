import { NextResponse } from 'next/server';

// Paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/verify'];

// Check if path is public
function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // static files like .js, .css, images
  ) {
    return NextResponse.next();
  }

  // Check for auth token (simple presence check - full verification in API)
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // No token - redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - allow request (API verifies token validity)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
