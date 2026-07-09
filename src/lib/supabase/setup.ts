import { createAdminClient } from "./admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "joyalsiby123@gmail.com";

export async function ensureAdminSetup(): Promise<boolean> {
  try {
    const adminClient = createAdminClient();

    const { error: rpcError } = await adminClient.rpc("check_admin_status");
    if (!rpcError) {
      return true;
    }

    const { error: tableError } = await adminClient
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (!tableError) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function ensureProfileForUser(userId: string, email: string): Promise<boolean> {
  try {
    const adminClient = createAdminClient();

    const { data: existing } = await adminClient
      .from("profiles")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    if (existing) {
      if (existing.role !== "admin") {
        const isAdminEmail = email === ADMIN_EMAIL;
        if (isAdminEmail) {
          await adminClient.from("profiles").update({ role: "admin" }).eq("id", userId);
        }
      }
      return true;
    }

    const isAdmin = email === ADMIN_EMAIL;
    await adminClient.from("profiles").insert({
      id: userId,
      email,
      role: isAdmin ? "admin" : "user",
      name: null,
    });

    return true;
  } catch {
    return false;
  }
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
