import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureProfileForUser, isAdminEmail } from "@/lib/supabase/setup";

export async function GET() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ admin: false }, { status: 401 });
  }

  // 1. Try RPC
  const { data: rpcData, error: rpcError } = await supabase.rpc("check_admin_status");
  if (!rpcError) {
    return NextResponse.json({ admin: !!rpcData });
  }

  // 2. Try profiles table via anon client
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileError && profile) {
      const isAdmin = profile.role === "admin";
      if (!isAdmin && (profile.role === null || profile.role === undefined || profile.role === "")) {
        const adminClient = createAdminClient();
        await adminClient.from("profiles").update({ role: "admin" }).eq("id", user.id);
        return NextResponse.json({ admin: true });
      }
      return NextResponse.json({ admin: isAdmin });
    }
  } catch {
    // profiles table may not exist
  }

  // 3. Fallback to email check + create profile via admin client
  if (isAdminEmail(user.email)) {
    try {
      await ensureProfileForUser(user.id, user.email ?? "");
      return NextResponse.json({ admin: true });
    } catch {
      return NextResponse.json({ admin: true });
    }
  }

  // 4. Try to ensure profile for non-admin user
  try {
    await ensureProfileForUser(user.id, user.email ?? "");
  } catch {
    // ignore
  }

  return NextResponse.json({ admin: false });
}
