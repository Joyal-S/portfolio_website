import type { Metadata } from "next";
import { getProjects } from "@/features/projects/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { ProjectGrid } from "@/features/projects/components/project-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of software projects, AI applications, and hackathon creations.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description="A collection of projects I've built — from web applications and AI tools to hackathon prototypes."
      />
      <Section>
        <ProjectGrid projects={projects} />
      </Section>
    </>
  );
}
