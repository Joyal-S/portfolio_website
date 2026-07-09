"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./project-card";
import { ProjectGridSkeleton } from "./project-skeleton";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: Array<{
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
  }>;
  loading?: boolean;
}

const categories = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Apps" },
  { value: "ai", label: "AI / ML" },
  { value: "hackathon", label: "Hackathons" },
];

export function ProjectGrid({ projects, loading = false }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const constraintsRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div ref={constraintsRef}>
      {/* Filter pills */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full border border-primary/30 bg-primary/10 shadow-glow"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <ProjectGridSkeleton count={6} />
      ) : filtered.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/20 bg-card/40">
            <svg className="h-7 w-7 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground/50">
            No projects in this category yet.
          </p>
        </motion.div>
      )}
    </div>
  );
}
