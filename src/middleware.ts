import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  if (!userId) {
    if (
      !req.nextUrl.pathname.startsWith('/api/users') &&
      req.nextUrl.pathname !== '/unverified'
    ) {
      auth().protect();
    }
    return NextResponse.next();
  }

  if (
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/unverified' ||
    req.nextUrl.pathname.startsWith('/api/users')
  ) {
    return NextResponse.next();
  }

  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const response = await fetch(`${baseUrl}/api/users/${userId}`);
  if (response.ok) {
    const user = await response.json();
    if (!user) {
      return NextResponse.redirect(new URL('/register', req.url));
    }
    if (!user.isVerified) {
      return NextResponse.redirect(new URL('/unverified', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
