import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { getProjectBySlug } from "@/features/projects/queries";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database-generated";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug) as Project | null;

  if (!project) {
    notFound();
  }

  const categoryLabel =
    { web: "Web App", ai: "AI / ML", hackathon: "Hackathon" }[
      project.category as string
    ] ?? project.category;

  return (
    <div className="pt-28 md:pt-32">
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to projects
        </Link>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="default">{categoryLabel}</Badge>
            {project.featured && (
              <Badge variant="purple">Featured</Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Source Code
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live Demo
              </a>
            )}
            {project.published_at && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(project.published_at)}
              </span>
            )}
          </div>

          {project.image_urls && project.image_urls.length > 0 && (
            <div className="grid gap-4 mb-8 grid-cols-1 md:grid-cols-2">
              {project.image_urls.map((url, i) => (
                <div key={i} className="relative w-full h-64 rounded-2xl overflow-hidden">
                  <Image
                    src={url}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}

          <Separator className="mb-8" />

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
