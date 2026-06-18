import { createClient } from "@supabase/supabase-js";

export function createAuthenticatedClient(
  accessToken: string
) {
    
  if (!accessToken) {
    throw new Error("Missing access token");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}