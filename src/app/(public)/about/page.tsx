import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { AboutContent } from "./about-content";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about me, my skills, and my journey as a developer.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        title="About Me"
        description="A bit about who I am, what I do, and what drives me."
      />
      <Section className="pt-0">
        <AboutContent
          name={settings.name}
          email={settings.email}
          githubUrl={settings.github_url}
          linkedinUrl={settings.linkedin_url}
        />
      </Section>
    </>
  );
}
