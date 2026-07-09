"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Code2,
  Palette,
  Server,
  Wrench,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  code2: Code2,
  palette: Palette,
  server: Server,
  wrench: Wrench,
  sparkles: Sparkles,
};

interface SkillCardProps {
  icon: string;
  category: string;
  skills: string[];
  proficiency: number;
  accent: "purple" | "indigo" | "blue" | "emerald" | "amber";
  index: number;
}

const accentStyles: Record<
  SkillCardProps["accent"],
  {
    icon: string;
    dot: string;
    bar: string;
    glow: string;
    stroke: string;
  }
> = {
  purple: {
    icon: "bg-purple-500/10 text-purple-400",
    dot: "bg-purple-400/60",
    bar: "from-purple-500/40 via-purple-500/20 to-transparent",
    glow: "shadow-glow",
    stroke: "#a78bfa",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-400",
    dot: "bg-indigo-400/60",
    bar: "from-indigo-500/40 via-indigo-500/20 to-transparent",
    glow: "shadow-glow-indigo",
    stroke: "#818cf8",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400/60",
    bar: "from-blue-500/40 via-blue-500/20 to-transparent",
    glow: "shadow-glow",
    stroke: "#60a5fa",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400/60",
    bar: "from-emerald-500/40 via-emerald-500/20 to-transparent",
    glow: "shadow-glow",
    stroke: "#34d399",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400/60",
    bar: "from-amber-500/40 via-amber-500/20 to-transparent",
    glow: "shadow-glow",
    stroke: "#fbbf24",
  },
};

export function SkillCard({
  icon,
  category,
  skills,
  proficiency,
  accent,
  index,
}: SkillCardProps) {
  const Icon = iconMap[icon] ?? Code2;
  const cardRef = useRef<HTMLDivElement>(null);
  const styles = accentStyles[accent];

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useTransform(tiltY, (latestY) => latestY * -8);
  const rotateY = useTransform(tiltX, (latestX) => latestX * 8);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    tiltX.set((clientX - centerX) / centerX);
    tiltY.set((clientY - centerY) / centerY);
  }, [tiltX, tiltY]);

  const handleMouseLeave = useCallback(() => {
    animate(tiltX, 0, { duration: 0.5, ease: "easeOut" });
    animate(tiltY, 0, { duration: 0.5, ease: "easeOut" });
  }, [tiltX, tiltY]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - proficiency / 100);
  const viewBoxSize = (radius + 8) * 2;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        willChange: "transform",
      }}
      className={cn(
        "group relative rounded-2xl",
        "border border-border/40",
        "bg-card/30 backdrop-blur-2xl",
        "p-6 sm:p-7",
        "transition-all duration-500",
        "hover:border-border/60",
        "hover:shadow-glow-lg",
        styles.glow,
      )}
    >
      {/* Accent bar at top */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          styles.bar,
        )}
      />

      {/* Hover glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              styles.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Progress circle */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg
              className="h-14 w-14 -rotate-90"
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            >
              <circle
                cx={viewBoxSize / 2}
                cy={viewBoxSize / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.06"
              />
              <motion.circle
                cx={viewBoxSize / 2}
                cy={viewBoxSize / 2}
                r={radius}
                fill="none"
                stroke={styles.stroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: strokeOffset }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.1 + 0.2,
                  ease: "easeOut",
                }}
              />
            </svg>
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums tracking-tight text-muted-foreground/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
            >
              {proficiency}
            </motion.span>
          </div>
        </div>

        {/* Category title */}
        <h3 className="mb-4 text-base font-semibold capitalize tracking-tight">
          {category}
        </h3>

        {/* Skills list */}
        <ul className="space-y-2.5">
          {skills.map((skill, i) => (
            <motion.li
              key={skill}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.1 + i * 0.05,
                ease: "easeOut",
              }}
              className="flex items-center gap-3 text-sm text-muted-foreground/90"
            >
              <span className={cn("h-1 w-1 shrink-0 rounded-full", styles.dot)} />
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
