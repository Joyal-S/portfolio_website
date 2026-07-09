import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectForm } from "./project-form";

interface Props {
  params: { id: string };
}

async function getProject(id: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export default async function AdminProjectEditPage({ params }: Props) {
  const isNew = params.id === "new";
  let project = null;

  if (!isNew) {
    project = await getProject(params.id);
    if (!project) notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isNew ? "New Project" : "Edit Project"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isNew
            ? "Add a new project to your portfolio."
            : `Editing: ${project?.title}`}
        </p>
      </div>

      <ProjectForm project={project} isNew={isNew} />
    </div>
  );
}
