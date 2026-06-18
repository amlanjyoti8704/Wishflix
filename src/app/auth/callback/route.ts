import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This route handles the OAuth callback from Supabase.
// After Google/GitHub authentication, Supabase redirects here with
// an auth code. We exchange that code for a session and set cookies.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profiles";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Exchange the auth code for a session (completes PKCE flow)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}${next}`
      );
    }
  }

  // If something went wrong, redirect to login with an error
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/login`
  );
}
