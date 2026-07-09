"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className={cn("absolute bottom-10 left-1/2 -translate-x-1/2", className)}
      aria-hidden="true"
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground/40 uppercase">
          Scroll
        </span>
        <div className="relative flex flex-col items-center gap-0.5">
          <div className="h-8 w-px bg-gradient-to-b from-primary/40 to-transparent" />
          <motion.div
            className="absolute -top-0.5 h-2 w-0.5 rounded-full bg-primary"
            animate={{ top: [0, 28, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
