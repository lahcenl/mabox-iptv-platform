/**
 * proxy.ts  (Next.js 16 — formerly middleware.ts)
 * Protects all /admin/* routes except /admin/login.
 * Reads the session cookie, verifies the HMAC token, and redirects to
 * /admin/login if the user is unauthenticated or the session is expired.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, COOKIE_NAME } from '@/lib/session';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // /admin/login is always public
  if (pathname.startsWith('/admin/login')) {
    // If already authenticated, redirect to dashboard
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = await decrypt(token);
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a valid session
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await decrypt(token);

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
