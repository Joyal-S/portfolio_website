import { createServerSupabase } from "@/lib/supabase/server";
import type { Post } from "@/types/database-generated";

export async function getPosts(): Promise<Post[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return data as Post | null;
}

export async function getAdminPosts(): Promise<Post[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Post[];
}

export async function getAdminPost(id: string): Promise<Post | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  return data as Post | null;
}


