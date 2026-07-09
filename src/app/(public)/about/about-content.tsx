"use client";

import { motion } from "framer-motion";
import {
  Coffee,
  Code2,
  Trophy,
  BookOpen,
  GraduationCap,
  Briefcase,
  Star,
  MapPin,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { SkillCard } from "@/components/shared/skill-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { SKILLS, SKILL_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

const timeline = [
  {
    year: "2024",
    title: "Master of Computer Applications",
    subtitle: "MCA Student",
    description:
      "Currently pursuing my MCA, building expertise in computer science, software architecture, and emerging technologies while working on real-world projects.",
    icon: GraduationCap,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    dotColor: "bg-purple-500",
  },
  {
    year: "2023",
    title: "Full Stack Developer",
    subtitle: "Building Modern Web Apps",
    description:
      "Developing production-grade applications with React, Next.js, TypeScript, Node.js, and integrating AI-powered features using LLMs and embeddings.",
    icon: Briefcase,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    dotColor: "bg-indigo-500",
  },
  {
    year: "2022",
    title: "Started Coding Journey",
    subtitle: "Self-Taught Developer",
    description:
      "Began with web development fundamentals — HTML, CSS, JavaScript — and quickly advanced to modern frameworks, databases, and full-stack architecture.",
    icon: Star,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Projects Built", accent: "purple" },
  { value: 10, suffix: "+", label: "Technologies", accent: "indigo" },
  { value: 3, suffix: "+", label: "Hackathons", accent: "emerald" },
  { value: 2, suffix: "+", label: "Years Coding", accent: "amber" },
] as const;

const facts = [
  { icon: Code2, text: "TypeScript is my primary language" },
  { icon: Trophy, text: "Multiple hackathon participant & winner" },
  { icon: BookOpen, text: "Avid reader of tech blogs & docs" },
  { icon: Coffee, text: "Debug mode: activated by coffee" },
  { icon: MapPin, text: "Based in Kerala, India — open to remote" },
] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

interface AboutContentProps {
  name: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export function AboutContent({ name, email, githubUrl, linkedinUrl }: AboutContentProps) {
  const initials = name.split(" ").map((n) => n[0]).join("");

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid lg:grid-cols-[400px_1fr] gap-16 lg:gap-20 xl:gap-24"
    >
      {/* ─── Left Column ─────────────────────────── */}
      <div className="space-y-10 lg:sticky lg:top-32 lg:self-start">
        {/* Portrait */}
        <motion.div variants={fadeUp}>
          <div className="relative mx-auto w-full max-w-[360px] lg:max-w-none">
            <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-2xl" />
            <div className="relative z-10 aspect-square w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/[0.08] shadow-glow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="select-none text-7xl sm:text-8xl font-bold tracking-tight text-foreground/[0.04]">
                  {initials}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <h2 className="text-xl font-bold tracking-tight">{name}</h2>
              <p className="mt-1 text-sm text-muted-foreground/70">
                MCA Student &middot; Full Stack Developer &middot; AI Enthusiast
              </p>
              <div className="mt-3 flex items-center justify-center lg:justify-start gap-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-card/40 text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary hover:shadow-glow"
                  aria-label="GitHub"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-card/40 text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary hover:shadow-glow"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-card/40 text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary hover:shadow-glow"
                  aria-label="Email"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-xl border border-border/30 bg-card/40 p-4 text-center backdrop-blur-xl",
              )}
            >
              <p className={cn(
                "text-2xl font-bold tracking-tight",
                stat.accent === "purple" && "text-purple-400",
                stat.accent === "indigo" && "text-indigo-400",
                stat.accent === "emerald" && "text-emerald-400",
                stat.accent === "amber" && "text-amber-400",
              )}>
                <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2} delay={0.2} />
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground/60">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Interesting facts */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.text}
                className="flex items-center gap-3 rounded-xl border border-border/20 bg-card/20 px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-border/40"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                <span className="text-xs text-muted-foreground/70 leading-snug">
                  {fact.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── Right Column ────────────────────────── */}
      <div className="space-y-16 lg:space-y-20">
        {/* Bio */}
        <motion.div variants={fadeUp}>
          <div className="space-y-6 max-w-xl">
            <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
              I&apos;m a developer pursuing a Master of Computer Applications,
              focused on building modern web experiences with clean architecture
              and thoughtful design.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground/70">
              Every project is an opportunity to learn, innovate, and deliver
              something that makes a difference. I work across the full stack —
              from React and Next.js on the frontend to Node.js and PostgreSQL
              on the backend — and I&apos;m always exploring AI integrations.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground/70">
              When I&apos;m not coding, you&apos;ll find me exploring new technologies,
              contributing to open source, or diving into the latest AI research.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeUp}>
          <h3 className="text-xl font-semibold tracking-tight mb-10">
            Journey
          </h3>

          <div className="relative space-y-0">
            {timeline.map((item, i) => {
              const Icon = item.icon;
              const isLast = i === timeline.length - 1;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    delay: i * 0.15,
                  }}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                      item.color,
                    )}>
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </div>
                    {!isLast && (
                      <div className="mt-2 h-full w-px bg-gradient-to-b from-border/60 to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <span className="text-xs font-semibold tracking-tight text-muted-foreground/50">
                      {item.year}
                    </span>
                    <h4 className="mt-1.5 text-lg font-semibold tracking-tight">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-sm font-medium text-muted-foreground/60">
                      {item.subtitle}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/70 max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div variants={fadeUp}>
          <h3 className="text-xl font-semibold tracking-tight mb-10">
            Skills & Technologies
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {SKILL_META.map(({ key, icon, proficiency, accent }, i) => (
              <SkillCard
                key={key}
                icon={icon}
                category={key}
                skills={SKILLS[key as keyof typeof SKILLS] as unknown as string[]}
                proficiency={proficiency}
                accent={accent}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
