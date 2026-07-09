import { createServerSupabase } from "@/lib/supabase/server";
import type { Project } from "@/types/database-generated";

export async function getProjects(): Promise<Project[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data as Project | null;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  return (data ?? []) as Project[];
}


