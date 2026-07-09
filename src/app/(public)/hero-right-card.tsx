"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Folder, GraduationCap, Briefcase } from "lucide-react";

const techIcons = [
  { name: "Next.js", src: "/tech/nextjs.svg" },
  { name: "React", src: "/tech/react.svg" },
  { name: "TypeScript", src: "/tech/typescript.svg" },
  { name: "Node.js", src: "/tech/nodejs.svg" },
  { name: "Supabase", src: "/tech/supabase.svg" },
  { name: "Java", src: "/tech/java.svg" },
  { name: "Python", src: "/tech/python.svg" },
  { name: "Git", src: "/tech/git.svg" },
  { name: "Tailwind CSS", src: "/tech/tailwindcss.svg" },
];

const floatingBadges = [
  {
    icon: Folder,
    value: "10+",
    label: "Projects",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    borderAccent: "border-l-purple-500/40",
    desktopPosition: "lg:top-6 lg:-right-8",
    floatDelay: "0s",
    floatDuration: 7,
    enterDelay: 0.7,
  },
  {
    icon: GraduationCap,
    value: "MCA",
    label: "Student",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    borderAccent: "border-l-indigo-500/40",
    desktopPosition: "lg:bottom-12 lg:-left-8",
    floatDelay: "-2s",
    floatDuration: 6,
    enterDelay: 1.0,
  },
  {
    icon: Briefcase,
    value: "Open",
    label: "To Work",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    borderAccent: "border-l-emerald-500/40",
    desktopPosition: "lg:top-1/3 lg:-translate-y-1/2 lg:-right-14",
    floatDelay: "-4s",
    floatDuration: 8,
    enterDelay: 1.3,
  },
];

function TechIcon({ name, src, index }: { name: string; src: string; index: number }) {
  const y = useMotionValue(0);
  const ySpring = useSpring(y, { stiffness: 60, damping: 10 });

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.05, duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => y.set(-6)}
      onMouseLeave={() => y.set(0)}
    >
      <motion.div
        className="flex flex-col items-center gap-1.5"
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        <motion.div
          className="flex h-[78px] w-[78px] items-center justify-center rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.06] group-hover:shadow-glow"
          style={{ y: ySpring }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Image
            src={src}
            alt={name}
            width={35}
            height={35}
            className="h-[35px] w-[35px]"
          />
        </motion.div>
        <span className="text-[11px] font-medium text-muted-foreground/60 text-center leading-tight">
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function RightCard({ name, profileImageUrl }: { name: string; profileImageUrl?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 200, damping: 30 });

  const shineX = useTransform(mouseX, [0, 1], [0, 100]);
  const shineY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const initials = useMemo(
    () => name.split(" ").map((n) => n[0]).join(""),
    [name],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-center justify-center lg:ml-16"
    >
      <div className="relative w-full max-w-[300px] lg:max-w-[375px]">
        {/* Background glow */}
        <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-[80px]" />

        {/* Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouse}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="relative z-10 overflow-hidden rounded-[24px] border border-border/30 bg-card/20 backdrop-blur-2xl shadow-glow-lg"
        >
          {/* Shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              background: `radial-gradient(circle at ${shineX}% ${shineY}%, white 0%, transparent 60%)`,
            }}
          />

          {/* Subtle noise */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.015] bg-noise" />

          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-secondary/[0.03]" />

          <div className="relative z-10 flex flex-col items-center px-6 py-7">
            {/* ─── Profile ─── */}
            <motion.div
              className="relative mb-5"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow halo */}
              <div className="absolute inset-0 -m-4 rounded-full bg-primary/20 blur-xl" />
              <motion.div
                className="absolute inset-0 -m-1.5 rounded-full border border-primary/20"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Avatar */}
              <div className="relative flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full border-2 border-border/40 bg-gradient-to-br from-primary/[0.12] via-card to-secondary/[0.12]">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <span className="select-none text-2xl font-bold tracking-tight text-foreground/60">
                    {initials}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Name & Title */}
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {name}
            </h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground/70">
              Full Stack Developer
            </p>
            <p className="text-[10px] text-muted-foreground/50">MCA Student</p>

            {/* Divider */}
            <div className="my-5 h-px w-14 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* ─── Tech Stack ─── */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {techIcons.map((tech, i) => (
                <TechIcon key={tech.name} {...tech} index={i} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating badges */}
        {floatingBadges.map(
          ({
            icon: Icon,
            value,
            label,
            iconColor,
            iconBg,
            borderAccent,
            desktopPosition,
            floatDelay,
            floatDuration,
            enterDelay,
          }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: enterDelay,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={`hidden lg:flex absolute ${desktopPosition} z-20 items-center gap-3 rounded-2xl border border-white/[0.04] bg-card/60 px-4 py-3 backdrop-blur-2xl shadow-glow/60 ${borderAccent}`}
              style={{
                animation: `float-medium ${floatDuration}s ease-in-out infinite`,
                animationDelay: floatDelay,
              }}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
              >
                <Icon className="h-[16px] w-[16px]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none tracking-tight">
                  {value}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground/70 leading-tight mt-0.5">
                  {label}
                </p>
              </div>
            </motion.div>
          ),
        )}
      </div>
    </motion.div>
  );
}