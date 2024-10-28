import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  // Skip onboarding check for API routes and the registration page
  if (
    req.nextUrl.pathname.startsWith('/api/users') ||
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/unverified'
  ) {
    console.log('skipping onboarding check');
    return NextResponse.next();
  }
  const { userId } = auth();
  if (userId) {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    if (response.ok) {
      const user = await response.json();
      console.log({ user });
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
