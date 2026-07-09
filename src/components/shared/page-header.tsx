"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="pt-28 pb-12 md:pt-32 md:pb-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
