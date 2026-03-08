import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/seller"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session — required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Single profile query for role + status checks on protected routes
  const needsProfileCheck = user && (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/admin")
  );

  if (needsProfileCheck) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    // Block suspended users
    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      const suspendedUrl = new URL("/login", request.url);
      suspendedUrl.searchParams.set("error", "account_suspended");
      return NextResponse.redirect(suspendedUrl);
    }

    // Admin routes: require admin role
    if (pathname.startsWith("/admin")) {
      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Seller routes: require seller, both, or admin role
    if (pathname.startsWith("/seller")) {
      const allowedRoles = ["seller", "both", "admin"];
      if (!profile || !allowedRoles.includes(profile.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Admin routes: redirect unauthenticated users (don't reveal admin exists)
  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes: redirect to login if no session
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Auth pages: redirect to dashboard if already authenticated
  if (user && authRoutes.some((route) => pathname === route)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets (images, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
