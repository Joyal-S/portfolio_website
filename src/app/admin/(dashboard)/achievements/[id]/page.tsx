import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AchievementForm } from "./achievement-form";

interface Props {
  params: { id: string };
}

async function getAchievement(id: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export default async function AdminAchievementEditPage({ params }: Props) {
  const isNew = params.id === "new";
  let achievement = null;

  if (!isNew) {
    achievement = await getAchievement(params.id);
    if (!achievement) notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isNew ? "New Achievement" : "Edit Achievement"}
        </h1>
      </div>
      <AchievementForm achievement={achievement} isNew={isNew} />
    </div>
  );
}
