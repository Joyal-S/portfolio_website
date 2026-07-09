import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminAchievementList } from "./achievement-list";

export const dynamic = "force-dynamic";

async function getAchievements() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .order("date", { ascending: false });

  return data ?? [];
}

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground mt-1">
            Manage your achievements and awards.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <Plus className="h-4 w-4 mr-2" />
            New Achievement
          </Link>
        </Button>
      </div>

      <AdminAchievementList achievements={achievements} />
    </div>
  );
}
