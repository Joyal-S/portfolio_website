"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    tech_stack: string[];
    repo_url: string | null;
    live_url: string | null;
    image_urls: string[];
    featured: boolean;
  };
  index?: number;
}

const categoryMeta: Record<string, { label: string; variant: "default" | "purple" | "indigo" }> = {
  web: { label: "Web App", variant: "default" },
  ai: { label: "AI / ML", variant: "purple" },
  hackathon: { label: "Hackathon", variant: "indigo" },
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const images = project.image_urls ?? [];
  const coverImage = images[galleryIndex];
  const meta = categoryMeta[project.category] ?? { label: project.category, variant: "default" as const };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({ x: ((y - centerY) / centerY) * -6, y: ((x - centerX) / centerX) * 6 });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? "transform 0.08s linear" : "transform 0.5s ease-out",
      }}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-2xl transition-shadow duration-500 hover:border-border/60 hover:shadow-glow-lg"
    >
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Image section */}
      {coverImage && (
        <Link href={`/projects/${project.slug}`} className="relative block overflow-hidden">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={project.title}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                "group-hover:scale-105",
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Category badge */}
          <div className="absolute left-4 top-4">
            <Badge variant={meta.variant} className="text-[10px] font-medium tracking-wide uppercase">
              {meta.label}
            </Badge>
          </div>

          {/* Image gallery dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setGalleryIndex(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === galleryIndex
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-white/40 hover:bg-white/70",
                  )}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Link>
      )}

      {/* Content */}
      <div className="p-5 sm:p-6">
        <Link href={`/projects/${project.slug}`} className="block mb-3">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
            {project.title}
          </h3>
        </Link>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
          {project.summary}
        </p>

        {/* Tech stack */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md border border-border/30 bg-card/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 5 && (
            <span className="inline-flex items-center rounded-md border border-border/30 bg-card/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/50">
              +{project.tech_stack.length - 5}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {project.live_url && (
            <>
              <Button asChild size="sm" variant="gradient" className="h-8 gap-1.5 px-3.5 text-xs">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  Live Demo
                </a>
              </Button>
              {project.repo_url && (
                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 px-3 text-xs">
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3" />
                    GitHub
                  </a>
                </Button>
              )}
            </>
          )}
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href={`/projects/${project.slug}`}>
              Case Study
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
