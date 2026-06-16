import { createBrowserClient } from "@supabase/ssr";

// createBrowserClient (from @supabase/ssr) stores auth tokens in COOKIES,
// not localStorage. This is critical because the Next.js middleware
// reads cookies to check if the user is logged in.
//
// If we used createClient from @supabase/supabase-js instead,
// tokens would go into localStorage — invisible to the server/middleware.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);