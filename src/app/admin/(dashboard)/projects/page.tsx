import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminProjectList } from "./project-list";

export const dynamic = "force-dynamic";

async function getProjects() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <AdminProjectList projects={projects} />
    </div>
  );
}
