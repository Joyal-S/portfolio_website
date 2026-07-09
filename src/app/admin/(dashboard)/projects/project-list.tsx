"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteProject } from "@/features/admin/actions";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  pinned: boolean;
  status: string;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  web: "Web App",
  ai: "AI / ML",
  hackathon: "Hackathon",
};

const statusMeta: Record<string, { label: string; variant: "outline" | "default" | "secondary" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  published: { label: "Published", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
};

export function AdminProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await deleteProject(id);
      toast.success("Project deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  if (projects.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground mb-4">
          No projects yet. Create your first one.
        </p>
        <Button asChild>
          <Link href="/admin/projects/new">
            Create Project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground">
                Title
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">
                Category
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">
                Status
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">
                Order
              </th>
              <th className="text-right p-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const status = statusMeta[project.status] ?? { label: project.status, variant: "outline" as const };
              return (
                <tr
                  key={project.id}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.title}</p>
                        {project.featured && (
                          <Badge variant="purple" className="text-[10px]">
                            Featured
                          </Badge>
                        )}
                        {project.pinned && (
                          <Badge variant="indigo" className="text-[10px]">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        /projects/{project.slug}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant="outline">
                      {categoryLabels[project.category] ?? project.category}
                    </Badge>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">
                    {project.sort_order}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
