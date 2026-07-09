"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  count?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

export function Particles({ className, count = 80 }: ParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 4,
      driftX: (Math.random() - 0.5) * 40,
      driftY: (Math.random() - 0.5) * 40 - 20,
    }));
  }, [count]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-foreground/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            willChange: "transform, opacity",
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
            x: [0, p.driftX * 0.5, 0],
            y: [0, p.driftY, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
