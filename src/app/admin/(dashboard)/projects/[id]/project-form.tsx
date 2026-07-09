"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject, updateProject } from "@/features/admin/actions";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { FileUpload } from "@/components/shared/file-upload";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string(),
  category: z.enum(["web", "ai", "hackathon"]),
  tech_stack: z.string(),
  repo_url: z.string().optional(),
  live_url: z.string().optional(),
  featured: z.boolean().optional(),
  pinned: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.coerce.number().int().min(0).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  tech_stack: string[];
  repo_url: string | null;
  live_url: string | null;
  featured: boolean;
  pinned: boolean;
  status: string;
  sort_order: number;
  published_at: string | null;
  image_urls: string[];
}

interface ProjectFormProps {
  project: Project | null;
  isNew: boolean;
}

export function ProjectForm({ project, isNew }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(project?.image_urls ?? []);
  const slugManuallyEdited = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      category: (project?.category as "web" | "ai" | "hackathon") ?? "web",
      tech_stack: project?.tech_stack?.join(", ") ?? "",
      repo_url: project?.repo_url ?? "",
      live_url: project?.live_url ?? "",
      featured: project?.featured ?? false,
      pinned: project?.pinned ?? false,
      status: (project?.status as "draft" | "published" | "archived") ?? "draft",
      sort_order: project?.sort_order ?? 0,
    },
  });

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("title", e.target.value);
      if (!slugManuallyEdited.current && isNew) {
        setValue("slug", slugify(e.target.value));
      }
    },
    [setValue, isNew],
  );

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    try {
      const techStackArray = data.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const now = new Date().toISOString();
      const publishedAt =
        data.status === "published"
          ? project?.status === "published"
            ? project?.published_at
            : now
          : null;

      const payload = {
        title: data.title,
        slug: data.slug || slugify(data.title),
        summary: data.summary,
        description: data.description,
        category: data.category,
        tech_stack: techStackArray,
        repo_url: data.repo_url || null,
        live_url: data.live_url || null,
        image_urls: imageUrls,
        featured: data.featured ?? false,
        pinned: data.pinned ?? false,
        status: data.status,
        sort_order: data.sort_order ?? 0,
        published_at: publishedAt,
      };

      if (isNew) {
        await createProject(payload);
        toast.success("Project created");
      } else if (project) {
        await updateProject(project.id, payload);
        toast.success("Project updated");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-xl p-6 space-y-6 max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            {...register("title")}
            placeholder="My Awesome Project"
            onChange={onTitleChange}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input
            {...register("slug")}
            placeholder="my-awesome-project"
            onChange={(e) => {
              slugManuallyEdited.current = true;
              setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            {...register("category")}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="web">Web App</option>
            <option value="ai">AI / ML</option>
            <option value="hackathon">Hackathon</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <Textarea
          {...register("summary")}
          placeholder="A brief description of the project..."
          rows={2}
        />
        {errors.summary && (
          <p className="text-xs text-destructive">{errors.summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description (Markdown)</label>
        <Textarea
          {...register("description")}
          placeholder="Full project description..."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <FileUpload
          bucket="projects"
          value={imageUrls}
          onChange={(v) => setImageUrls(v as string[])}
          multiple
          accept="image/*"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tech Stack</label>
        <Input
          {...register("tech_stack")}
          placeholder="React, Next.js, TypeScript, Tailwind CSS"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated list of technologies
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub URL</label>
          <Input
            {...register("repo_url")}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Live Demo</label>
          <Input
            {...register("live_url")}
            placeholder="https://my-project.vercel.app"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Display Order</label>
          <Input
            {...register("sort_order")}
            type="number"
            min="0"
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Lower numbers appear first
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("featured")}
            className="rounded border-border bg-background text-primary focus:ring-primary"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("pinned")}
            className="rounded border-border bg-background text-primary focus:ring-primary"
          />
          Pinned to Home
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isNew ? "Create Project" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
