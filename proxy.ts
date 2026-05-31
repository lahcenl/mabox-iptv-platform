import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard HTML Routes
  if (pathname.startsWith('/alt7km')) {
    // Bypasses login page
    if (pathname === '/alt7km/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('admin_session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session) {
      const loginUrl = new URL('/alt7km/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard API Routes
  if (pathname.startsWith('/api/alt7km')) {
    // Bypasses auth login route itself
    if (pathname === '/api/alt7km/auth') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('admin_session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/alt7km/:path*', '/api/alt7km/:path*'],
};
