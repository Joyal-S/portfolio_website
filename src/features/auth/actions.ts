"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureProfileForUser, isAdminEmail } from "@/lib/supabase/setup";

async function checkAdminStatus(userId: string, email: string | undefined): Promise<boolean> {
  const supabase = createServerSupabase();

  // 1. Try RPC
  try {
    const { data, error } = await supabase.rpc("check_admin_status");
    if (!error) {
      return !!data;
    }
  } catch {
    // RPC does not exist
  }

  // 2. Try profiles table
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (profile) {
      return profile.role === "admin";
    }
  } catch {
    // profiles table may not exist
  }

  // 3. Try admin client (service role) to check/create profile
  try {
    const profile = await ensureProfileForUser(userId, email ?? "");
    if (profile) {
      const { data: p2 } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (p2) return p2.role === "admin";
    }
  } catch {
    // admin client may fail
  }

  // 4. Fallback to email check
  return isAdminEmail(email);
}

export async function signIn(email: string, password: string, redirectTo?: string) {
  const supabase = createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return { error: "Authentication failed." };
  }

  const isAdmin = await checkAdminStatus(user.id, user.email);

  if (!isAdmin) {
    return { error: "You do not have admin access." };
  }

  revalidatePath("/admin");
  return { redirectTo: redirectTo || "/admin" };
}

export async function signOut() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath("/admin/login");
  redirect("/admin/login");
}

export async function verifyAdminSession() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authenticated: false, admin: false };
  }

  const isAdmin = await checkAdminStatus(user.id, user.email);

  return { authenticated: true, admin: isAdmin };
}
