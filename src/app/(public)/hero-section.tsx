"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { RightCard } from "./hero-right-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { Particles } from "@/components/shared/particles";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface HeroSectionProps {
  name?: string;
  heroTitle?: string;
  heroDescription?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  resumeUrl?: string;
  profileImageUrl?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const itemFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HeroSection({
  name = DEFAULT_SETTINGS.name,
  heroTitle = DEFAULT_SETTINGS.hero_title,
  heroDescription = DEFAULT_SETTINGS.hero_description,
  githubUrl = DEFAULT_SETTINGS.github_url,
  linkedinUrl = DEFAULT_SETTINGS.linkedin_url,
  email = DEFAULT_SETTINGS.email,
  resumeUrl,
  profileImageUrl,
}: HeroSectionProps) {
  const socialLinks = useMemo(
    () => [
      { href: githubUrl, icon: Github, label: "GitHub" },
      { href: linkedinUrl, icon: Linkedin, label: "LinkedIn" },
      { href: `mailto:${email}`, icon: Mail, label: "Email" },
    ],
    [githubUrl, linkedinUrl, email],
  );

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <AuroraBackground />
      <Particles count={100} />

      <Container className="relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28 items-center"
        >
          {/* ─── Left Column ───────────────────────────── */}
          <div className="flex flex-col gap-10">
            <motion.h1
              variants={itemFromLeft}
              className="flex flex-col gap-1"
            >
              <span className="text-base sm:text-lg font-medium text-muted-foreground/50 tracking-wide">
                {heroTitle}
              </span>
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.04] text-gradient-animated glow-text">
                {name}
              </span>
            </motion.h1>

            <motion.p
              variants={itemFromLeft}
              className="text-sm sm:text-base md:text-lg text-muted-foreground/70 leading-relaxed max-w-lg"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              variants={itemFromBottom}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button asChild size="xl" variant="gradient" className="group relative overflow-hidden">
                <Link href="/projects">
                  <span className="relative z-10 flex items-center gap-2">
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href={resumeUrl || "#"} download={resumeUrl ? "Joyal_Siby_Resume.pdf" : undefined} className={resumeUrl ? "" : "pointer-events-none opacity-50"}>
                  <span className="flex items-center gap-2">
                    Download Resume
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </Button>
              <Button asChild variant="link" size="lg" className="text-muted-foreground hover:text-foreground">
                <Link href="/contact">Let&apos;s talk</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemFromBottom}
              className="flex items-center gap-3 pt-2"
            >
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-card/20 text-muted-foreground/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary hover:shadow-glow"
                  aria-label={label}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-[18px] w-[18px] transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/30 bg-card/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70 opacity-0 backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100">
                    {label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ─── Right Column ──────────────────────────── */}
          <RightCard name={name} profileImageUrl={profileImageUrl} />
        </motion.div>
      </Container>

      <ScrollIndicator />
    </section>
  );
}
