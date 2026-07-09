import type { Metadata } from "next";
import { getAchievements } from "@/features/achievements/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { GlowCard } from "@/components/shared/glow-card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Hackathon wins, awards, and notable achievements.",
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <>
      <PageHeader
        title="Achievements"
        description="Hackathon victories, awards, and recognition I've earned along the way."
      />
      <Section>
        {achievements.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement, i) => (
              <GlowCard key={achievement.id} delay={i * 0.1}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={
                        achievement.type === "hackathon" ? "indigo" : "purple"
                      }
                    >
                      {achievement.type === "hackathon"
                        ? "Hackathon"
                        : "Award"}
                    </Badge>
                    {achievement.link && (
                      <a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 mb-3">
                    <Trophy className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formatDate(achievement.date)}
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No achievements yet"
            description="My accomplishments will be listed here."
            icon={<Trophy className="h-8 w-8" />}
          />
        )}
      </Section>
    </>
  );
}
