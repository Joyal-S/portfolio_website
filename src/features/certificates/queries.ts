import { createServerSupabase } from "@/lib/supabase/server";
import type { Certificate } from "@/types/database-generated";

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("issue_date", { ascending: false });

  return (data ?? []) as Certificate[];
}
