"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_LINKS, DEFAULT_SETTINGS } from "@/lib/constants";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  name?: string;
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative flex h-4 w-4 items-center justify-center">
      <motion.span
        className="absolute left-0 top-0 h-px w-full rounded-full bg-current"
        animate={
          isOpen
            ? { rotate: 45, y: 7.5, width: "100%" }
            : { rotate: 0, y: 0, width: "100%" }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-current"
        animate={
          isOpen
            ? { opacity: 0, x: 8 }
            : { opacity: 1, x: 0 }
        }
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full rounded-full bg-current"
        animate={
          isOpen
            ? { rotate: -45, y: -7.5, width: "100%" }
            : { rotate: 0, y: 0, width: "100%" }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </div>
  );
}

const linkVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04 },
};

export function Header({ name = DEFAULT_SETTINGS.name }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const diff = current - lastScrollY.current;
      if (current < 20) {
        setIsHidden(false);
      } else if (diff > 10 && current > 60) {
        setIsHidden(true);
      } else if (diff < -5) {
        setIsHidden(false);
      }
      lastScrollY.current = current;
    }, 50);
  });

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      animate={{ y: isHidden ? -120 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className={cn(
            "relative flex items-center justify-between",
            "rounded-2xl border border-border/30",
            "bg-background/60 px-4 py-2 sm:px-5",
            "backdrop-blur-2xl shadow-lg shadow-black/5",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            aria-label="Home"
          >
            {name}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.href}
                  initial="rest"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm rounded-full transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/10"
                        transition={{
                          type: "spring",
                          bounce: 0.18,
                          duration: 0.5,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="relative z-10 flex items-center gap-0.5">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "flex md:hidden h-8 w-8 items-center justify-center rounded-lg",
                "text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-foreground",
              )}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden mt-2"
            >
              <div className="rounded-2xl border border-border/30 bg-background/70 p-2 backdrop-blur-2xl shadow-lg">
                <nav className="flex flex-col gap-0.5">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={cn(
                          "relative px-4 py-2.5 text-sm rounded-xl transition-colors",
                          active
                            ? "bg-primary/10 font-medium text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
