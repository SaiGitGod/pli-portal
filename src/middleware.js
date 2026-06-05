import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('pli-token')?.value;
  const userCookie = request.cookies.get('pli-user')?.value;
  const path = request.nextUrl.pathname;

  if (path === '/' || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (path.startsWith('/buyer') || path.startsWith('/vendor')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      if (path.startsWith('/buyer') && user.role !== 'buyer') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (path.startsWith('/vendor') && user.role !== 'vendor') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/buyer/:path*', '/vendor/:path*'],
};
