import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/setup";

export async function checkAdminStatus(): Promise<{ isAdmin: boolean }> {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return { isAdmin: false };
  }

  // 1. Try RPC
  try {
    const { data, error } = await supabase.rpc("check_admin_status");
    if (!error) {
      return { isAdmin: !!data };
    }
  } catch {
    // RPC does not exist
  }

  // 2. Try profiles table
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) {
      return { isAdmin: profile.role === "admin" };
    }
  } catch {
    // profiles table may not exist
  }

  // 3. Fallback to email check
  return { isAdmin: isAdminEmail(user.email) };
}
