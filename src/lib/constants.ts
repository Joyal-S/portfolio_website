export const DEFAULT_SETTINGS = {
  name: "Joyal Siby",
  profession: "MCA Student | Full Stack Developer | AI Enthusiast",
  bio: "",
  email: "joyalsiby123@gmail.com",
  phone: "",
  github_url: "https://github.com/Joyal-S",
  linkedin_url: "https://www.linkedin.com/in/joyalsiby123/",
  twitter_url: "",
  youtube_url: "",
  portfolio_url: "",
  resume_url: "",
  profile_image_url: "",
  logo: "",
  favicon: "",
  hero_title: "Hi, I'm",
  hero_description:
    "I build modern, scalable, and user-focused web applications using modern technologies. Passionate about full-stack development, AI-powered solutions, and creating premium digital experiences.",
  seo_title: "MCA Student | Full Stack Developer | AI Enthusiast",
  seo_description:
    "I build modern, scalable, and user-focused web applications using modern technologies.",
  footer_text: "Built with Next.js & Supabase",
} as const;

export const SITE = {
  name: DEFAULT_SETTINGS.name,
  title: DEFAULT_SETTINGS.seo_title,
  description: DEFAULT_SETTINGS.seo_description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certificates" },
  { href: "/achievements", label: "Achievements" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const SKILLS = {
  languages: ["TypeScript", "JavaScript", "Python", "Java", "SQL"],
  frontend: ["React", "Next.js", "HTML/CSS", "Tailwind CSS", "Framer Motion"],
  backend: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
  tools: ["Git", "Docker", "VS Code", "Figma", "Vercel"],
  ai: ["OpenAI API", "LangChain", "Hugging Face", "TensorFlow"],
} as const;

export const SKILL_META = [
  { key: "languages", icon: "code2", proficiency: 85, accent: "purple" as const },
  { key: "frontend", icon: "palette", proficiency: 92, accent: "indigo" as const },
  { key: "backend", icon: "server", proficiency: 80, accent: "blue" as const },
  { key: "tools", icon: "wrench", proficiency: 85, accent: "emerald" as const },
  { key: "ai", icon: "sparkles", proficiency: 75, accent: "amber" as const },
] as const;

export const SOCIAL_LINKS = {
  github: DEFAULT_SETTINGS.github_url,
  linkedin: DEFAULT_SETTINGS.linkedin_url,
  email: DEFAULT_SETTINGS.email,
} as const;
