"use client";

import { Container } from "./container";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface FooterProps {
  name?: string;
}

const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Supabase",
];

export function Footer({ name = DEFAULT_SETTINGS.name }: FooterProps) {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 border-t border-border/20 bg-card/20 backdrop-blur-2xl" />

      <Container className="relative z-10">
        <div className="py-10 md:py-14">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground/60">
              Designed &amp; Developed by{" "}
              <span className="font-medium text-foreground/80">{name}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground/60">
              <span>Made with</span>
              {techStack.map((tech, i) => (
                <span key={tech}>
                  <span className="font-medium text-foreground/70">{tech}</span>
                  {i < techStack.length - 1 && (
                    <span className="ml-1.5 text-muted-foreground/30">&bull;</span>
                  )}
                </span>
              ))}
            </div>

            <div className="mt-4 h-px w-16 bg-border/20" />

            <p className="text-xs text-muted-foreground/40">
              &copy; 2026 {name}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
