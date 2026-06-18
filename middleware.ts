import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Start with a "pass-through" response.
  // Supabase will attach refreshed auth cookies to this response.
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // DEBUG: log env vars availability and cookies
  console.log("[middleware]", request.nextUrl.pathname, {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    cookies: request.cookies.getAll().map((c) => c.name),
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error("[middleware] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY!");
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        // 1) Set on the request (so downstream code sees them)
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        // 2) Re-create the response so the request changes propagate
        response = NextResponse.next({
          request: { headers: request.headers },
        });

        // 3) Set on the response (so the browser receives them)
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  // IMPORTANT: This refreshes the session and writes updated cookies.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // DEBUG: log session result
  console.log("[middleware]", request.nextUrl.pathname, {
    hasSession: !!session,
    userId: session?.user?.id ?? "none",
  });

  // ── Helper: redirect while preserving auth cookies ──────────
  function redirectTo(path: string) {
    const redirectResponse = NextResponse.redirect(
      new URL(path, request.url)
    );
    // Copy all cookies from the Supabase-updated response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // 🔒 Protected routes — redirect to login if not authenticated
  const protectedRoutes = ["/browse", "/profiles", "/admin"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    console.log("[middleware] REDIRECTING to /login (no session for protected route)");
    return redirectTo("/login");
  }

  // 🔐 Admin check
  if (session && request.nextUrl.pathname.startsWith("/admin")) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (error || data?.role !== "admin") {
      return redirectTo("/browse");
    }
  }

  // ✅ Already logged in — bounce away from login/signup
  if (
    session &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return redirectTo("/profiles");
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