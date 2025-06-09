import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware hit");
  const { userId } = await auth();
  if (!userId) {
    console.log("No userId, redirecting...");
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`);
  }
  return NextResponse.next(); // important to proceed if user is authenticated
});

export const config = {
  matcher: [
    "/((?!_next|sign-in|sign-up|favicon.ico|.*\\..*).*)", // ⛔ exclude sign-in and static files
  ],
};
