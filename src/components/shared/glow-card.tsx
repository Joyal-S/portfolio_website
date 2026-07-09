"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlowCard({
  children,
  className,
  delay = 0,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: "transform, opacity" }}
      className={cn(
        "group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-glow",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
