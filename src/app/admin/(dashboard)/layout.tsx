import { redirect } from "next/navigation";
import { AdminShell } from "./admin-shell";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/setup";

export const metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let isAdmin = false;

  // 1. Try RPC
  try {
    const { data, error } = await supabase.rpc("check_admin_status");
    if (!error) {
      isAdmin = !!data;
    }
  } catch {
    // RPC does not exist
  }

  // 2. Try profiles table
  if (!isAdmin) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        isAdmin = profile.role === "admin";
      }
    } catch {
      // profiles table may not exist
    }
  }

  // 3. Fallback to email check
  if (!isAdmin) {
    isAdmin = isAdminEmail(user.email);
  }

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
