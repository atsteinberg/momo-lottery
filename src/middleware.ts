import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export default clerkMiddleware(async (auth, req) => {
  // Skip onboarding check for API routes and the registration page
  if (
    req.nextUrl.pathname.startsWith('/api/users') ||
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/unverified'
  ) {
    return NextResponse.next();
  }
  const { userId } = auth();
  if (userId) {
    const baseUrl = getBaseUrl();
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
  }
  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
