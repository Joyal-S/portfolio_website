export type ProjectCategory = "web" | "ai" | "hackathon";
export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectFormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  tech_stack: string[];
  repo_url: string;
  live_url: string;
  image_urls: string[];
  featured: boolean;
  pinned: boolean;
  status: ProjectStatus;
  sort_order: number;
  published_at: string;
}
