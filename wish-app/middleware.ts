import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },

        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🔒 Protected routes
  const protectedRoutes = ["/browse", "/profiles", "/admin"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // ❌ Not logged in
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Checking if the user is admin
  if (session && request.nextUrl.pathname.startsWith("/admin")) {

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (error || data?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/browse", request.url)
      );
    }
  }

  // ✅ Already logged in
  if (
    session &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/profiles", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/browse/:path*",
    "/profiles/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};