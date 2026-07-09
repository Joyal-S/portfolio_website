"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "@/features/admin/actions";
import { toast } from "sonner";
import { DEFAULT_SETTINGS } from "@/lib/constants";
interface Settings {
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
  profile_image_url: string;
  logo: string;
  favicon: string;
  hero_title: string;
  hero_description: string;
  seo_title: string;
  seo_description: string;
  footer_text: string;
}

const defaultSettings: Settings = {
  name: DEFAULT_SETTINGS.name,
  profession: DEFAULT_SETTINGS.profession,
  bio: DEFAULT_SETTINGS.bio,
  email: DEFAULT_SETTINGS.email,
  phone: DEFAULT_SETTINGS.phone,
  github_url: DEFAULT_SETTINGS.github_url,
  linkedin_url: DEFAULT_SETTINGS.linkedin_url,
  twitter_url: DEFAULT_SETTINGS.twitter_url,
  youtube_url: DEFAULT_SETTINGS.youtube_url,
  portfolio_url: DEFAULT_SETTINGS.portfolio_url,
  profile_image_url: DEFAULT_SETTINGS.profile_image_url,
  logo: DEFAULT_SETTINGS.logo,
  favicon: DEFAULT_SETTINGS.favicon,
  hero_title: DEFAULT_SETTINGS.hero_title,
  hero_description: DEFAULT_SETTINGS.hero_description,
  seo_title: DEFAULT_SETTINGS.seo_title,
  seo_description: DEFAULT_SETTINGS.seo_description,
  footer_text: DEFAULT_SETTINGS.footer_text,
};

interface Props {
  settings: Settings | null;
}

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Settings>(() => ({
    ...defaultSettings,
    ...settings,
  }));

  const set = (key: keyof Settings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sections: { label: string; fields: (keyof Settings)[] }[] = [
    {
      label: "Personal Information",
      fields: ["name", "profession", "bio", "email", "phone"],
    },
    {
      label: "Social Links",
      fields: [
        "github_url",
        "linkedin_url",
        "twitter_url",
        "youtube_url",
      ],
    },
    {
      label: "Portfolio",
      fields: ["portfolio_url"],
    },
    {
      label: "Hero Section",
      fields: ["hero_title", "hero_description"],
    },
    {
      label: "SEO",
      fields: ["seo_title", "seo_description"],
    },
    {
      label: "Footer",
      fields: ["footer_text"],
    },
  ];

  const fieldLabels: Record<keyof Settings, string> = {
    name: "Name",
    profession: "Profession",
    bio: "Bio",
    email: "Email",
    phone: "Phone",
    github_url: "GitHub URL",
    linkedin_url: "LinkedIn URL",
    twitter_url: "X / Twitter URL",
    youtube_url: "YouTube URL",
    portfolio_url: "Portfolio URL",
    profile_image_url: "Profile Picture URL",
    logo: "Logo URL",
    favicon: "Favicon URL",
    hero_title: "Hero Title",
    hero_description: "Hero Description",
    seo_title: "SEO Title",
    seo_description: "SEO Description",
    footer_text: "Footer Text",
  };

  const isTextarea: Partial<Record<keyof Settings, boolean>> = {
    bio: true,
    hero_description: true,
    seo_description: true,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSiteSettings(form as unknown as Record<string, unknown>);
      toast.success("Settings saved");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {sections.map((section) => (
        <div key={section.label} className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{section.label}</h2>
          <div className="space-y-4">
            {section.fields.map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium">{fieldLabels[key]}</label>
                {isTextarea[key] ? (
                  <Textarea
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "text"
                    }
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </form>
  );
}
