/**
 * proxy.ts  (Next.js 16 — formerly middleware.ts)
 * Protects all /admin/* routes except /admin/login.
 * Reads the session cookie, verifies the HMAC token, and redirects to
 * /admin/login if the user is unauthenticated or the session is expired.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, COOKIE_NAME } from '@/lib/session';

const LOCALES = ['ar', 'fr'];
const DEFAULT_LOCALE = 'en';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Authenticated Admin Checks
  if (pathname.startsWith('/admin')) {
    // /admin/login is always public
    if (pathname.startsWith('/admin/login')) {
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

  // 2. Locale prefix redirect and rewrite logic
  // Enforce prefix-free URL for English: Redirect /en/about -> /about
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const cleanPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    const redirectUrl = new URL(`${cleanPath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if pathname starts with other supported locales (ar, fr)
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If no locale prefix, internally rewrite to /en prefix so Next.js routes to app/[locale]/
  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files (svg, png, jpg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
