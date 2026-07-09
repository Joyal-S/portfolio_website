"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(from);

  useMotionValueEvent(count, "change", (v) => {
    if (ref.current) {
      ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`;
    }
  });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(count, to, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, count, to, duration, delay]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}
      {from}
      {suffix}
    </motion.span>
  );
}
