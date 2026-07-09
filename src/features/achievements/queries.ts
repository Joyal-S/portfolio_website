import { createServerSupabase } from "@/lib/supabase/server";
import type { Achievement } from "@/types/database-generated";

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .order("date", { ascending: false });

  return (data ?? []) as Achievement[];
}
