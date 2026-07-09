export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: "web" | "ai" | "hackathon";
  tech_stack: string[];
  repo_url: string | null;
  live_url: string | null;
  image_urls: string[];
  featured: boolean;
  pinned: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "hackathon" | "award";
  link: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Json;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id" | "created_at" | "updated_at">>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Certificate, "id" | "created_at" | "updated_at">>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Achievement, "id" | "created_at" | "updated_at">>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Post, "id" | "created_at" | "updated_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
      };
    };
    Enums: {
      project_category: "web" | "ai" | "hackathon";
      project_status: "draft" | "published" | "archived";
      achievement_type: "hackathon" | "award";
      post_status: "draft" | "published";
    };
  };
}
