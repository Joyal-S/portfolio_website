import { cache } from "react";
import { createServerSupabase } from "./supabase/server";
import { DEFAULT_SETTINGS } from "./constants";

export interface SiteSettings {
  name: string;
  profession: string;
  bio: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
  portfolio_url: string;
  resume_url: string;
  profile_image_url: string;
  logo: string;
  favicon: string;
  hero_title: string;
  hero_description: string;
  seo_title: string;
  seo_description: string;
  footer_text: string;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.from("site_settings").select("*").single();
    if (error || !data) {
      return DEFAULT_SETTINGS;
    }
    
    const merged = { ...DEFAULT_SETTINGS } as SiteSettings;
    (Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]).forEach((key) => {
      const dbValue = data[key];
      if (dbValue !== null && dbValue !== undefined && dbValue !== "") {
        Object.assign(merged, { [key]: dbValue });
      } else if (dbValue === "") {
        Object.assign(merged, { [key]: "" }); // Preserve explicit empty values (like phone)
      }
    });
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
});
