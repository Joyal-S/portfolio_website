import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const { supabase, response } = updateSession(request);

  let user;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  // Redirect unauthenticated users away from admin (except login page)
  if (isAdminRoute && !isLoginPage && !user) {
    const url = new URL("/admin/login", request.url);
    const redirectRes = NextResponse.redirect(url);
    // Forward any auth cookies from updateSession
    for (const cookie of response.cookies.getAll()) {
      redirectRes.cookies.set(cookie.name, cookie.value);
    }
    return redirectRes;
  }

  // For authenticated users on the login page, redirect to admin
  if (user && isLoginPage) {
    const url = new URL("/admin", request.url);
    const redirectRes = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectRes.cookies.set(cookie.name, cookie.value);
    }
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|images/).*)",
  ],
};
