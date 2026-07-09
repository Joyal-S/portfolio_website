import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlowCard } from "@/components/shared/glow-card";
import { SkillCard } from "@/components/shared/skill-card";
import { ProjectCard } from "@/features/projects/components/project-card";
import { getFeaturedProjects } from "@/features/projects/queries";
import { getPosts } from "@/features/blog/queries";
import { getAchievements } from "@/features/achievements/queries";
import { HeroSection } from "./hero-section";
import { SKILLS, SKILL_META } from "@/lib/constants";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, posts, achievements, settings] = await Promise.all([
    getFeaturedProjects(),
    getPosts(),
    getAchievements(),
    getSiteSettings(),
  ]);

  const latestPosts = posts.slice(0, 3);
  const latestAchievements = achievements.slice(0, 3);

  const heroProps = {
    name: settings.name,
    heroTitle: settings.hero_title,
    heroDescription: settings.hero_description,
    githubUrl: settings.github_url,
    linkedinUrl: settings.linkedin_url,
    email: settings.email,
    resumeUrl: settings.resume_url,
    profileImageUrl: settings.profile_image_url,
  };

  return (
    <>
      <HeroSection {...heroProps} />

      <Section id="featured-projects">
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of projects I'm most proud of."
        />
        {featuredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/20 bg-card/40">
              <svg className="h-7 w-7 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground/50 mb-4">
              Projects coming soon.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">View all projects</Link>
            </Button>
          </div>
        )}
        {featuredProjects.length > 0 && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/projects">
                View all projects
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </Section>

      <Section id="skills" className="bg-muted/30">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Tools and technologies I work with."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {SKILL_META.map(({ key, icon, proficiency, accent }, i) => (
            <SkillCard
              key={key}
              icon={icon}
              category={key}
              skills={SKILLS[key as keyof typeof SKILLS] as unknown as string[]}
              proficiency={proficiency}
              accent={accent}
              index={i}
            />
          ))}
        </div>
      </Section>

      {latestAchievements.length > 0 && (
        <Section id="achievements">
          <SectionHeading
            title="Recent Achievements"
            subtitle="Hackathon wins and awards."
          />
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {latestAchievements.map((achievement, i) => (
              <GlowCard key={achievement.id} delay={i * 0.1}>
                <div className="p-6">
                  <Badge
                    variant={
                      achievement.type === "hackathon" ? "indigo" : "purple"
                    }
                    className="mb-3"
                  >
                    {achievement.type}
                  </Badge>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
              </GlowCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/achievements">
                View all achievements
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {latestPosts.length > 0 && (
        <Section id="blog" className="bg-muted/30">
          <SectionHeading
            title="Latest Posts"
            subtitle="Recent articles and tutorials."
          />
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {latestPosts.map((post, i) => (
              <GlowCard key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              </GlowCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                Read all posts
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      <Section id="cta">
        <div className="glass rounded-2xl p-12 md:p-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Have a project in mind?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            I&apos;m currently open to freelance work and full-time opportunities.
            If you have a project that needs a capable developer, let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" aria-hidden="true" />
                View GitHub
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
