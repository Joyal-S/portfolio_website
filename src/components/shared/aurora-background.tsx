"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
}

type BlobConfig = {
  size: number;
  initialX: number | string;
  initialY: number | string;
  color: string;
  blur: string;
  moveX: number[];
  moveY: number[];
  duration: number;
};

const blobs: BlobConfig[] = [
  {
    size: 700,
    initialX: -200,
    initialY: -100,
    color: "bg-primary/20",
    blur: "blur-[140px]",
    moveX: [0, 120, -60, 80, 0],
    moveY: [0, -100, 60, -40, 0],
    duration: 25,
  },
  {
    size: 600,
    initialX: "50%",
    initialY: 100,
    color: "bg-secondary/[0.18]",
    blur: "blur-[130px]",
    moveX: [0, -80, 100, -60, 0],
    moveY: [0, 80, -40, 100, 0],
    duration: 30,
  },
  {
    size: 550,
    initialX: "70%",
    initialY: -150,
    color: "bg-purple-500/[0.15]",
    blur: "blur-[120px]",
    moveX: [0, 60, -100, 40, 0],
    moveY: [0, -60, 80, -100, 0],
    duration: 22,
  },
  {
    size: 450,
    initialX: "20%",
    initialY: "60%",
    color: "bg-indigo-500/[0.15]",
    blur: "blur-[110px]",
    moveX: [0, -40, 80, -60, 0],
    moveY: [0, -80, 40, 60, 0],
    duration: 28,
  },
  {
    size: 500,
    initialX: -100,
    initialY: "70%",
    color: "bg-pink-500/[0.08]",
    blur: "blur-[120px]",
    moveX: [0, 100, -40, 80, 0],
    moveY: [0, 40, -80, -40, 0],
    duration: 26,
  },
  {
    size: 400,
    initialX: "80%",
    initialY: "30%",
    color: "bg-cyan-500/[0.06]",
    blur: "blur-[100px]",
    moveX: [0, -60, 60, -80, 0],
    moveY: [0, 60, -60, 80, 0],
    duration: 24,
  },
];

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div
      ref={sectionRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <motion.div style={{ opacity, y }} className="absolute inset-0">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            className={`absolute ${blob.color} ${blob.blur} rounded-full`}
            style={
              {
                width: blob.size,
                height: blob.size,
                left: typeof blob.initialX === "number" ? blob.initialX : blob.initialX,
                top: typeof blob.initialY === "number" ? blob.initialY : blob.initialY,
                willChange: "transform",
              } as React.CSSProperties
            }
            animate={{
              x: blob.moveX,
              y: blob.moveY,
              scale: [1, 1.15, 0.95, 1.1, 1],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * -2,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
    </div>
  );
}
