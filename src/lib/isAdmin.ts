import { supabase } from "../../lib/supabaseClient";

export async function isAdmin() {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return false;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  return data?.role === "admin";
}